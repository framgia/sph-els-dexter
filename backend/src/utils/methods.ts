import {hashSync, compareSync} from "bcrypt"
import {SignOptions, sign} from "jsonwebtoken"
import {SALTROUND, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} from "./../configs"
import {ITokenBody} from "./../types"

export const comparePassword = (hashed: string, plain: string): boolean => compareSync(plain, hashed)

export const hashPassword = (text: string): string | undefined => {
  if (!SALTROUND) return undefined
<<<<<<< Updated upstream
  
=======
>>>>>>> Stashed changes
  return hashSync(text, parseInt(SALTROUND))
}

export const generateToken = (body: ITokenBody, type: "access" | "refresh"): string | null => {
  if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) return null
<<<<<<< Updated upstream
=======
  
>>>>>>> Stashed changes
  const secret: string = type === "access"
    ? ACCESS_TOKEN_SECRET
    : REFRESH_TOKEN_SECRET
  const options: SignOptions | undefined = type === "access"
    ? {expiresIn: 8 * 60 * 60 * 1000}
    : undefined

  return sign(body, secret, options)
}
