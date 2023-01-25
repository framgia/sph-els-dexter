import {Request, Response} from "express"
import {EHttpStatusCode} from "../../enums";
import {ITypedRequestBody, IWordOptions, ICategory} from "./../../types"
import {ErrorException, respondError} from "./../../utils"
import {Word, Category} from "./../../schemas"

interface IAddWordPayload {
  word: string;
  choices: IWordOptions[];
}

export const QuizController = {
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
