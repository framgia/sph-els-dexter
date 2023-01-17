import {Express} from "express"
import {UserModel} from "./../routes"

export const router = (app: Express) => {
  app.use("/", UserModel)
}
