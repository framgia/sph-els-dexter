import {Request, Response, NextFunction} from "express"

export const setAuthorizationHeader = (req: Request, res: Response, next: NextFunction) => {
  const cookie = req.headers && req.headers["cookie"]

  const accessTokenPair: string[] | undefined = cookie 
    ? cookie.split("; ")
    : undefined

  if (accessTokenPair) {
    const accessToken: string = accessTokenPair[0].split("=")[1]

    req.headers["authorization"] = `Bearer ${accessToken}`
  }

  next()
}
