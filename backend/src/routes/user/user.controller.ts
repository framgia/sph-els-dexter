import {CookieOptions, Request, Response} from "express"
import {respondError, ErrorException, generateToken, comparePassword} from "./../../utils"
import {IUser, ITokenBody, IUserSession} from "./../../types"
import {User, UserSession} from "./../../schemas"
import {EHttpStatusCode, EToken} from "./../../enums"
import {S3_DEFAULT_IMAGE} from "./../../configs"

interface IUserCredentials {
  email: string;
  password: string;
}

export const UserController = {
  LOGIN: async (req: Request, res: Response) => {
    try {
      const {email, password}: IUserCredentials = req.body

      if (!email || !password) throw new ErrorException("Email and password is required.")

      const user: IUser = await User.findOne<IUser>({email}, "password name role avatar").exec() as IUser

      if (!user || !user.password) throw new ErrorException("Invalid email or password.")

      const isPasswordCorrect: boolean = comparePassword(user.password, password)

      if (!isPasswordCorrect) throw new ErrorException("Invalid email or password.")

      const tokenBody: ITokenBody = {
        avatar: user.avatar || S3_DEFAULT_IMAGE || "",
        email,
        name: user.name,
        role: user.role ? "admin" : "student"
      }

      const accessToken: string | null = generateToken(tokenBody, "access") ?? ""
      const refreshToken: string | null = generateToken(tokenBody, "refresh") ?? ""

      const updateSession = await UserSession.findOneAndUpdate({userId: user._id}, {
        sessionToken: refreshToken,
        updatedAt: Date.now()
      })

      if (!updateSession) throw new ErrorException("Session data could not be updated.")

      const cookieOptions: CookieOptions = {
        expires: EToken.EXPIRY,
        httpOnly: true
      }

      res.cookie("access_token", accessToken, cookieOptions)
      res.cookie("refresh_token", refreshToken)
      
      res.status(EHttpStatusCode.OK).send({
        message: "You are successfully logged in."
      })
    } catch (err) {
      respondError(err, res)
    }
  },
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
        avatar: S3_DEFAULT_IMAGE || "", 
        name, 
        email,
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

      const cookieOptions: CookieOptions = {expires: EToken.EXPIRY}

      res.cookie("access_token", accessToken, cookieOptions)
      res.cookie("refresh_token", refreshToken)
      
      res.status(EHttpStatusCode.OK).send({
        message: "You are successfully registered."
      })
    } catch (err) {
      respondError(err, res)
    }
  }
}
