import {Response} from "express"
import {ITypedRequestBody, IWordOptions} from "./../../types"
import {ErrorException, respondError} from "./../../utils"

interface IAddWordPayload {
  word: string;
  choices: IWordOptions[];
}

export const QuizController = {
  ADD_WORD: async (req: ITypedRequestBody<IAddWordPayload>, res: Response) => {
    try {
      const {word}: IAddWordPayload = req.body

      if (!word) throw new ErrorException("Word is required.")
    } catch (err) {
      respondError(err, res)
    }
  }
}
