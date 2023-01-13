import {Response} from "express"

export class ErrorException extends Error {
  code: number
  message: string

  constructor(
    message: string = "Internal Server Error",
    code: number = 500
  ) {
    super()

    this.code = code
    this.message = message
  }
}

export const respondError = (error: unknown, res: Response): void => {
  const err: ErrorException = error as ErrorException

  res.status(err.code || 500).send({
    message: err.message || "Internal Server Error"
  })
}