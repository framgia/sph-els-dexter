import {Request, Response} from "express"
import {respondError, ErrorException, generateToken} from "./../../utils"
import {IUser, ITokenBody, IUserSession} from "./../../types"
import {User, UserSession} from "./../../schemas"
import {EHttpStatusCode, EToken} from "./../../enums"
import {S3_DEFAULT_IMAGE} from "./../../configs"

export const UserController = {
  CREATE_USER: async (req: Request, res: Response) => {
    try {
      const avatar: string | undefined = S3_DEFAULT_IMAGE

      const {name, email, password, role}: IUser = req.body

      if (!name || !email || !password) throw new ErrorException("Name, email or password is missing from payload.")

      const data: IUser = {
        name, email, 
        password,
        avatar, role
      }

      const userInstance = new User(data)

      const userId: string = userInstance.toObject()._id as unknown as string
      const tokenBody: ITokenBody = {
        userId, name, email,
        role: role === 0 ? "student" : "admin"
      }

      const accessToken: string | null = generateToken(tokenBody, "access")
      const refreshToken: string | null = generateToken(tokenBody, "refresh")

      const sessionData: IUserSession = {
        userId, sessionToken: refreshToken ?? ""
      }

      const userSessionInstance = new UserSession(sessionData)
      
      await Promise.all([
        userInstance.save(),
        userSessionInstance.save()
      ])

      res.status(EHttpStatusCode.OK).send({
        data: {
          accessToken,
          refreshToken,
          expiresIn: EToken.EXPIRY
        },
        message: "You are successfully registered."
      })
    } catch (err) {
      respondError(err, res)
    }
  }
}
