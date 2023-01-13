import {Request, Response} from "express"
import {respondError} from "./../../utils"

export const UserController = {
  CREATE_USER: async (req: Request, res: Response) => {
    try {

    } catch (err) {
      respondError(err, res)
    }
  }
}