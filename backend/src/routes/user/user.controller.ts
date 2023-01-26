import {CookieOptions, Response} from "express"
import {respondError, ErrorException, generateToken, comparePassword} from "./../../utils"
import {IUser, ITokenBody, IUserSession, IAuditLogs, ITypedRequestBody, IWordsLearned} from "./../../types"
import {User, UserSession} from "./../../schemas"
import {EHttpStatusCode, EToken} from "./../../enums"
import {S3_DEFAULT_IMAGE} from "./../../configs"

interface IUserCredentials {
  email: string;
  password: string;
}

interface IAuditLogQuery {
  auditTrail: IAuditLogs[]
}

interface IEmailPayload {
  email?: string;
}

interface ISocialQueryResponse {
  followers?: string[];
  following?: string[];
  wordsLearned?: IWordsLearned[];
}

export const UserController = {
  SOCIAL: async (req: ITypedRequestBody<IEmailPayload>, res: Response) => {
    try {
      const {email}: IEmailPayload = req.body

      if (!email) throw new ErrorException("Email is missing from payload.")

      const socialRecord: ISocialQueryResponse | null = await User.findOne({email}, "followers following wordsLearned")

      if (!socialRecord) throw new ErrorException("User not found.")

      res.status(EHttpStatusCode.OK).send({
        data: {
          followers: socialRecord && socialRecord.followers ? socialRecord.followers.length : 0,
          following: socialRecord && socialRecord.following ? socialRecord.following.length : 0,
          wordsLearned: socialRecord.wordsLearned ? socialRecord.wordsLearned.length : 0
        },
        message: "Social record is successfully fetched."
      })
    } catch (err) {
      respondError(err, res)
    }
  },
  AUDIT_LOG: async (req: ITypedRequestBody<IEmailPayload>, res: Response) => {
    const {email} = req.body

    try {
      /** 
       * 
       * If user_id is missing from params,
       * that means that the client is requesting for the
       * list of audit logs from all users (for dashboard data),
       * then we have to sort it using 
       * the field `createdAt`
       */
      const auditLog: IAuditLogQuery | IAuditLogQuery[] | null = !email
        ? await User.find<IAuditLogQuery>({}, "auditTrail name").exec()
        : await User.findOne<IAuditLogQuery>({email}, "auditTrail name").exec()
      
      if (!auditLog) throw new ErrorException("User not found.")

      res.status(EHttpStatusCode.OK).send({
        data: auditLog,
        message: "Audit logs successfully fetched."
      })
    } catch (err) {
      respondError(err, res)
    }
  },
  LOGOUT: async (req: ITypedRequestBody<{email: string}>, res: Response) => {
    try {
      const {email} = req.body

      if (!email) throw new ErrorException("Email is missing from payload.")

      const user: {_id: string} | null = await User.findOne({email}, "_id").exec()

      if (!user) throw new ErrorException("User not found.")

      const {_id} = user

      const removeAccess = await UserSession.findOneAndUpdate({userId: _id}, {sessionToken: null, updatedAt: Date.now()}).exec()

      if (!removeAccess) throw new ErrorException("Unable to process logout, please try again later.")

      res.clearCookie("access_token")
      res.clearCookie("refresh_token")

      res.status(EHttpStatusCode.OK).send({
        message: "You are successfully logged out."
      })
    } catch (err) {
      respondError(err, res)
    }
  },
  LOGIN: async (req: ITypedRequestBody<IUserCredentials>, res: Response) => {
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
  CREATE_USER: async (req: ITypedRequestBody<IUser>, res: Response) => {
    try {
      const avatar: string | undefined = S3_DEFAULT_IMAGE

      const {name, email, password}: IUser = req.body
      const role = 0

      if (!name || !email || !password) throw new ErrorException("Name, email or password is missing from payload.")

      const data: IUser = {
        name, email, 
        password,
        avatar
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
