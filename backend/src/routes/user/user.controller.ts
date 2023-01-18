import {Request, Response} from "express"
import {ErrorException, respondError, generateToken, comparePassword} from "./../../utils"
import {S3_DEFAULT_IMAGE} from "./../../configs"
import {IUser, ITokenBody, IUserSession} from "./../../types"
import {EHttpStatusCode, EToken} from "./../../enums"
import {User, UserSession} from "./../../schemas"

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
  },
  LOGIN: async (req: Request, res: Response) => {
    try {
      interface ICredentials {
        email: string;
        password: string;
      }

      const {email, password}: ICredentials = req.body

      if (!email || !password) throw new ErrorException("Email and password is required.")

      const userDetails: IUser | null = await User.findOne<IUser>({email}).exec()

      if (!userDetails) throw new ErrorException("Invalid username or password.")

      const isPasswordCorrect: boolean = comparePassword(userDetails.password, password)

      if (!isPasswordCorrect) throw new ErrorException("Invalid username or password.")

      const tokenBody: ITokenBody = {
        userId: userDetails._id,
        name: userDetails.name,
        email,
        role: userDetails.role ? "admin" : "student"
      }

      const accessToken: string | null = generateToken(tokenBody, "access")
      const refreshToken: string | null = generateToken(tokenBody, "refresh")

      const saveSession = await UserSession.findOneAndUpdate({userId: userDetails._id}, {
        sessionToken: refreshToken, 
        updatedAt: Date.now()
      })

      if (!saveSession) {
        const newSession = new UserSession({
          userId: userDetails._id,
          sessionToken: refreshToken
        })

        await newSession.save()
      }

      res.status(EHttpStatusCode.OK).send({
        data: {
          accessToken,
          refreshToken,
          expiresIn: EToken.EXPIRY
        },
        message: "You are successfully logged in."
      })
    } catch (err) {
      respondError(err, res)
    }
  }
}
