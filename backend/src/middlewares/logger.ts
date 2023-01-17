import {Request, Response, NextFunction} from "express"
import {EEnvironment} from "./../enums"
import {NODE_ENV} from "./../configs"

export const logger = (req: Request, res: Response, next: NextFunction) => {
  if (NODE_ENV && NODE_ENV === EEnvironment.DEVELOPMENT) {
    console.log("\n")
    console.log("Request Path: ", req.path)
    console.log("Request Method: ", req.method)
    console.log("Request Headers: ", req.headers)
    console.log("Request Payload: ", req.body)
    console.log("\n")
  }
  next()
}
