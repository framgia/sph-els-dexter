import {Express} from "express"
import {UserModel, QuizModel} from "./../routes"

export const router = (app: Express) => {
  app.use("/", UserModel)
  app.use("/quiz", QuizModel)
}
