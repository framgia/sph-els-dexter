import {hashSync} from "bcrypt"
import {SALTROUND} from "./../configs"

export const hashPassword = (text: string): string | undefined => {
  if (!SALTROUND) return undefined

  return hashSync(text, parseInt(SALTROUND))
}