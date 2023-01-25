import {Request, Response} from "express"
import {EHttpStatusCode} from "../../enums";
import {ITypedRequestBody, IWordOptions, ICategory} from "./../../types"
import {ErrorException, respondError} from "./../../utils"
import {Word, Category} from "./../../schemas"

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
