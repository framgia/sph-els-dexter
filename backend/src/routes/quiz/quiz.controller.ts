import {Request, Response} from "express"
import {EHttpStatusCode} from "../../enums";
import {ITypedRequestBody, IWordOptions, ICategory, IUserQuiz, IQuizProgress, IWord, IUser} from "./../../types"
import {ErrorException, respondError} from "./../../utils"
import {Word, Category, UserQuiz, User} from "./../../schemas"

interface IAddWordPayload {
  word: string;
  choices: IWordOptions[];
}

interface IAddCategoryWordPayload {
  categoryId: string;
  words: string[];
}

interface IUpdateCategoryPayload {
  categoryId: string;
  words: string[];
  title: string;
  description: string;
}

interface IAnswerQuizPayload {
  categoryId: string;
  email: string;
  progress: IQuizProgress[]
}

export const QuizController = {
  SUBMIT_QUIZ: async (req: ITypedRequestBody<IAnswerQuizPayload>, res: Response) => {
    try {
      const {categoryId, email, progress}: IAnswerQuizPayload = req.body

      if (!categoryId || !email || !progress) throw new ErrorException("categoryId, email and progress are required from payload.")

      const userData: IUser | null = await User.findOne<IUser>({email}, "_id").exec()

      if (!userData) throw new ErrorException("This user does not exist.")

      const {_id: userId} = userData

      await UserQuiz.findOneAndUpdate({categoryId, userId}, {
        $set: {
          progress
        }
      }, {upsert: true})

      res.status(EHttpStatusCode.OK).send({
        message: "Quiz completed."
      })
    } catch (err) {
      respondError(err, res)
    }
  },
  START_QUIZ: async (req: ITypedRequestBody<{categoryId: string; email: string}>, res: Response) => {
    try {
      const {categoryId, email} = req.body

      if (!categoryId || !email) throw new ErrorException("categoryId and email is required from payload.")

      // Getting userId based on email
      const userDocument: IUser | null = await User.findOne<IUser>({email}).exec()

      if (!userDocument || (userDocument && !userDocument._id)) throw new ErrorException("User does not exist.")

      // Fetching the words for the category
      const categoryDocument: ICategory | null = await Category.findById<ICategory>(categoryId).exec()

      if (!categoryDocument) throw new ErrorException("Record for this category is wiped out, unable to start this quiz.")

      // Words with options
      const words: IWord[] = categoryDocument.words && categoryDocument.words.length
        ? (await Promise.all([...categoryDocument.words.map((word: string) => Word.findById(word))]) as IWord[])
          .map((word: IWord) => {
            word._id = word._id?.toString()

            return word
          })
        : []

      const totalQuestions: number = words.length

      // Creating current progress record based on the words found on categoryDocument query
      const currentProgress: IQuizProgress = {
        answeredAt: new Date(),
        currentScore: 0,
        latestProgress: true,
        correctAnsweredWords: [],
        incorrectAnsweredWords: [],
        unansweredWords: categoryDocument.words && categoryDocument.words.length
          ? [...new Set([...categoryDocument.words.map((word: string) => word.toString())])]
          : []
      }

      // Checking if there is a recorded quiz for this student and category
      const quizDocument: IUserQuiz | null = await UserQuiz.findOne<IUserQuiz>({
        categoryId,
        userId: userDocument._id
      }).exec()

      // Check if there is already a record
      if (quizDocument && quizDocument._id) {
        // Check the progress history
        if (quizDocument.progress && quizDocument.progress.length) {
          // Get last progress record
          const lastProgress: IQuizProgress = quizDocument.progress[quizDocument.progress.length-1]

          const [
            lastUnansweredQuestions, 
            lastCorrecAnsweredQuestions,
            lastIncorrectAnsweredQuestions
          ]: [string[], string[], string[]] = [
            lastProgress.unansweredWords,
            lastProgress.correctAnsweredWords,
            lastProgress.incorrectAnsweredWords
          ]
          
          const previousUnansweredLength: number = lastUnansweredQuestions.length

          const touchedQuestions: string[] = [...new Set([...lastCorrecAnsweredQuestions, ...lastIncorrectAnsweredQuestions])] as string[]
          
          // Trim off the questions/words to send to client based on last progress touched questions
          touchedQuestions.forEach((wordId: string) => {
            const wordIndex: number | undefined = words.findIndex((word: IWord) => word._id && word._id.toString() === wordId)

            if (wordIndex > -1) {
              // Remove this word from the list of words to send to FE
              words.splice(wordIndex, 1)
            }
          })

          // Check if new word have been added for this category
          words.forEach((word: IWord) => {
            if (word._id) {
              if (!lastUnansweredQuestions.includes(word._id.toString())) {
                if (!touchedQuestions.includes(word._id.toString())) {
                  lastUnansweredQuestions.push(word._id.toString())
                }
              }
            }
          })

          // Check if a word has been removed from this category
          lastUnansweredQuestions.forEach((item: string) => {
            if (!words.find((word: IWord) => word._id && word._id.toString() === item.toString())) {
              lastUnansweredQuestions.splice(lastUnansweredQuestions.findIndex((x: string) => x === item), 1)
            }
          })

          // Check if unanswered questions have changed
          if (previousUnansweredLength !== lastUnansweredQuestions.length) {
            // update progress object to be sent to FE
            lastProgress.unansweredWords = lastUnansweredQuestions

            quizDocument.progress[quizDocument.progress.length-1].unansweredWords = lastUnansweredQuestions

            // update userquiz document
            await UserQuiz.findByIdAndUpdate(quizDocument._id, {
              $set: {progress: quizDocument.progress}
            })
          }

          return res.status(EHttpStatusCode.OK).send({
            data: {
              progress: lastProgress,
              words,
              totalQuestions
            },
            message: "Quiz progress retained."
          })
        }

        // Quiz is previously recorded but there is no progress history yet, save progress with default values
        const quiz: IUserQuiz = {
          categoryId,
          userId: userDocument._id!,
          progress: [currentProgress]
        }

        // To avoid duplicates
        await UserQuiz.findOneAndUpdate({categoryId, userId: userDocument._id}, quiz, {upsert: true})

        return res.status(EHttpStatusCode.OK).send({
          data: {
            progress: currentProgress,
            words,
            totalQuestions
          },
          message: "Initial progress saved."
        })
      }

      // This is a new quiz, no record yet (to avoid duplicate, I used findOneAndUpdate with upsert enabled)
      await UserQuiz.findOneAndUpdate(
        {categoryId, userId: userDocument._id},
        {categoryId, userId: userDocument._id, progress: [currentProgress]},
        {upsert: true}  
      )

      res.status(EHttpStatusCode.OK).send({
        data: {
          progress: currentProgress,
          words,
          totalQuestions
        },
        message: "Quiz is successfully started."
      })
    } catch (err) {
      respondError(err, res)
    }
  },
  DELETE_CATEGORY: async (req: Request, res: Response) => {
    try {
      const {id} = req.params

      const query = await Category.findByIdAndDelete(id).exec()

      if (!query) throw new ErrorException("Category not deleted, something went wrong.")

      res.status(EHttpStatusCode.OK).send({
        message: "Category is successfully deleted."
      })
    } catch (err) {
      respondError(err, res)
    }
  },
  UPDATE_CATEGORY: async (req: ITypedRequestBody<IUpdateCategoryPayload>, res: Response) => {
    try {
      const {categoryId, description, title, words}: IUpdateCategoryPayload = req.body

      if (!categoryId) throw new ErrorException("Category ID is missing from payload.")

      const query = await Category.findByIdAndUpdate(categoryId, {
        words, title, description
      }).exec()

      if (!query) throw new ErrorException("Category is not updated, something went wrong.")

      res.status(EHttpStatusCode.OK).send({
        message: "Category is succesfully updated."
      })
    } catch (err) {
      respondError(err, res)
    }
  },
  WORD_DATA: async (req: ITypedRequestBody<{words: string[]}>, res: Response) => {
    try {
      const {words} = req.body

      if (!words.length) return res.sendStatus(EHttpStatusCode.OK)

      const queries = await Promise.all([
        ...words.map((id: string) => {
          return Word.findById(id, "word").exec()
        })
      ])

      res.status(EHttpStatusCode.OK).send({
        data: queries,
        message: "Word data is successfully fetched."
      })
    } catch (err) {
      respondError(err, res)
    }
  },
  ADD_CATEGORY_WORD: async (req: ITypedRequestBody<IAddCategoryWordPayload>, res: Response) => {
    try {
      const {categoryId, words}: IAddCategoryWordPayload = req.body

      if (!categoryId || !words) throw new ErrorException("Category ID and words must be provided.")

      const query = await Category.findOneAndUpdate({_id: categoryId}, {words})

      if (!query) throw new ErrorException("Unable to update category words.")

      res.status(EHttpStatusCode.OK).send({
        data: query,
        message: "Word is successfully added."
      })
    } catch (err) {
      respondError(err, res)
    }
  },
  CATEGORY_LIST: async (req: Request, res: Response) => {
    try {
      const list = await Category.find({status: "active"}, "title description words").exec()

      res.status(EHttpStatusCode.OK).send({
        data: list,
        message: "Category list is successfully fetched."
      })
    } catch (err) {
      respondError(err, res)
    }
  },
  WORD_LIST: async (req: Request, res: Response) => {
    try {
      const list = await Word.find({}, "word options").exec()

      res.status(EHttpStatusCode.OK).send({
        data: list,
        message: "List is successfully fetched."
      })
    } catch (err) {
      respondError(err, res)
    }
  },
  ADD_CATEGORY: async (req: ITypedRequestBody<ICategory>, res: Response) => {
    try {
      const {title, description}: ICategory = req.body

      if (!title || !description) throw new ErrorException("Title and description is required.")

      const categoryData = new Category({title, description})

      const query = await categoryData.save()

      if (!query) throw new ErrorException("Category is not saved, something went wrong.")

      res.status(EHttpStatusCode.OK).send({
        data: query,
        message: "Category is successfully added."
      })
    } catch (err) {
      respondError(err, res)
    }
  },
  ADD_WORD: async (req: ITypedRequestBody<IAddWordPayload>, res: Response) => {
    try {
      const {word, choices}: IAddWordPayload = req.body

      if (!word) throw new ErrorException("Word is required.")

      const wordData = new Word({word, options: choices})

      const query = await wordData.save()

      if (!query) throw new ErrorException("Word is not added, something went wrong.")

      res.status(EHttpStatusCode.OK).send({
        data: query,
        message: "Word is successfully added."
      })
    } catch (err) {
      respondError(err, res)
    }
  }
}
