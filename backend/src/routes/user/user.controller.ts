import {Request, Response} from "express"
import {respondError, ErrorException, hashPassword} from "./../../utils"
import {IUser} from "./../../types"
import {User} from "./../../schemas"
import {EHttpStatusCode} from "./../../enums"

export const UserController = {
  CREATE_USER: async (req: Request, res: Response) => {
    try {
      const avatar: string | undefined = req.file && (req.file as Express.MulterS3.File).location
        ? (req.file as Express.MulterS3.File).location
        : undefined

      const {name, email, password, role}: IUser = req.body

      const data: IUser = {
        name, email, password,
        avatar, role
      }

      if (!name || !email || !password) throw new ErrorException("Name, email or password is missing from payload.")

      const hashedPassword: string | undefined = hashPassword(password)
      
      if (!hashedPassword) throw new ErrorException("Salt round is not defined from env file.")

      const userData = new User(data)

      await userData.save()
      res.status(EHttpStatusCode.OK).send({
        message: "You are successfully registered."
      })
    } catch (err) {
      respondError(err, res)
    }
  }
}