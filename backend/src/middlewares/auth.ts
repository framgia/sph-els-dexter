import {Request, Response, NextFunction} from "express"
import {EHttpStatusCode} from "./../enums"
import {verifyAccessToken} from "./../utils"

/**
 * 
 * We don't want to check for auth headers
 * from this route, as cookie is not
 * yet set from here
 */
const publicRoutes: string[] = ["/create", "/login"]

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  if (!publicRoutes.includes(req.path)) {
    const headers = req.headers
    const authorizationHeader: string | undefined = headers && headers["authorization"]

    if (!authorizationHeader) return res.status(EHttpStatusCode.FORBIDDEN).send({
      message: "Authorization header is missing from the request."
    })

    const headerContent: string[] | undefined = authorizationHeader.split(" ")

    if (!headerContent || (headerContent && headerContent.length === 1)) return res.status(EHttpStatusCode.UNAUTHORIZED).send({
      message: "Auth type is missing from auth header."
    })

    if (headerContent[0].toLowerCase() !== "bearer") return res.status(EHttpStatusCode.UNAUTHORIZED).send({
      message: "Invalid auth type."
    })

    const accessToken: string = headerContent[1]

    const isTokenValid = verifyAccessToken(accessToken)

    if (!isTokenValid) return res.status(EHttpStatusCode.UNAUTHORIZED).send({
      message: "Access token has expired, please refresh the token using the refresh token from cookie."
    })
  }

  next()
}
