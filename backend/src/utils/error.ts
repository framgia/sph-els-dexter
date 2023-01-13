import {Response} from "express"
import {EHttpStatusCode} from "./../enums"

export class ErrorException extends Error {
  code: number
  message: string

  constructor(
    message: string = "Internal Server Error",
    code: number = EHttpStatusCode.INTERNAL_SERVER_ERROR
  ) {
    super()

    this.code = code
    this.message = message
  }
}

export const respondError = (error: unknown, res: Response): void => {
  const err: ErrorException = error as ErrorException

  res.status(err.code || EHttpStatusCode.INTERNAL_SERVER_ERROR).send({
    message: err.message || "Internal Server Error"
  })
}