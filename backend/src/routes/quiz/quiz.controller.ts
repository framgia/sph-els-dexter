import {Request, Response} from "express"
import {EHttpStatusCode} from "../../enums";
import {ITypedRequestBody, IWordOptions, ICategory, IUserQuiz, IQuizProgress, IWord} from "./../../types"
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

export const QuizController = {
  START_QUIZ: async (req: ITypedRequestBody<{categoryId: string; email: string}>, res: Response) => {
    try {
      const {categoryId, email} = req.body

      if (!categoryId && !email) throw new ErrorException("categoryId and email is required.")

      const userData: {_id: string} | null = await User.findOne<{_id: string}>({email}, "_id").exec()

      if (!userData) throw new Error("User not found.")

      const userId = userData._id
      const currentProgress: IUserQuiz | null = await UserQuiz.findOne<IUserQuiz>({
        categoryId, userId
      }).exec()

      if (currentProgress) {
        /** Get latest progress */
        const foundProgress: IQuizProgress | undefined = currentProgress.progress && currentProgress.progress.find((item: IQuizProgress) => item.latestProgress)
        const progress: IQuizProgress | undefined = currentProgress.progress
          ? foundProgress ?? undefined
          : undefined

        const unansweredWords: (string| undefined)[] = progress 
          ? progress.unansweredWords.length
          ? progress.unansweredWords.map((item: string | undefined) => item!.toString())
          : []
          : []
        
        let finalUnansweredWords: (string | undefined)[] = unansweredWords
        const unansweredWordsCount: number = finalUnansweredWords.length

        /**
         * 
         * Get category words just to check
         * if there are newly added/removed 
         * words from this category
         */
        const wordData: {words: string[]} | null = await Category.findById<{words: string[]}>(categoryId, "words").exec()

        if (wordData) {
          /** There are words set for this category, compare with the saved unanswered word */
          if (wordData.words.length >= finalUnansweredWords.length) { /** <-- This means that a new word is added to this category */
            wordData.words.forEach((item: string) => {
              if (!finalUnansweredWords.includes(item)) {
                finalUnansweredWords = [...finalUnansweredWords, item]
              }
            })
          } else {  /** <-- This means that a new word is removed from this category */
            unansweredWords.forEach((item: string | undefined) => {
              if (!wordData.words.includes(item!)) {
                finalUnansweredWords.splice(finalUnansweredWords.findIndex((x: string | undefined) => x! === item), 1)
              }
            })
          }
        } else {
          /** No words found, this category is updated and words are removed. */
          finalUnansweredWords = []
        }

        /** Listen to a change un unanswered words */
        if (unansweredWordsCount !== finalUnansweredWords.length) {
          await UserQuiz.updateOne<IUserQuiz>({categoryId, userId}, {
            progress: [
              ...currentProgress.progress!.map((item: IQuizProgress) => {
                if (item.latestProgress) {
                  item.unansweredWords = finalUnansweredWords
                }

                return item
              })
            ]
          })
        }
 
        if (finalUnansweredWords) {
          const wordsToDisplay = finalUnansweredWords
            .map((item: string | undefined) => Word.findById(item).exec())

          const words: IWord[] | undefined = await Promise.all(wordsToDisplay) as unknown as IWord[]

          return res.status(EHttpStatusCode.OK).send({
            data: {
              progress,
              words
            },
            message: "Past data is successfully fetched."
          })
        }

        return res.status(EHttpStatusCode.OK).send({
          data: {
            progress,
            words: []
          },
          message: "Past data is successfully fetched."
        })
      }

      /** It execution gets here, that means that this is a new quiz. */
      const categoryWords: {words?: string[]} | null = await Category.findById<{words?: string[]}>(categoryId, "words")

      if (categoryWords) {
        const words: IWord[] | null = categoryWords.words ? await Promise.all([
          ...categoryWords.words.map((item: string) => {
            return Word.findById(item).exec()
          }) as unknown as IWord[] || null
        ]) : null

        const unansweredWords: (string | undefined)[] = words && words.length
          ? [...words].map((item: IWord) => item._id)
          : []

        const quizProgress: IQuizProgress = {
          latestProgress: true,
          unansweredWords: unansweredWords,
          currentScore: 0,
          correctAnsweredWords: [],
          answeredAt: new Date()
        }

        const newQuiz = new UserQuiz({
          categoryId,
          userId,
          progress: [quizProgress]
        })
  
        await newQuiz.save()
  
        return res.status(EHttpStatusCode.OK).send({
          data: {
            progress: [],
            words
          },
          message: "Quiz started."
        })
      }

      res.status(EHttpStatusCode.OK).send({
        data: {
          progress: [],
          words: []
        },
        message: "No words for this category."
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
