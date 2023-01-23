import jwt from "jwt-decode"

export const verifyToken = (token: string) => jwt(token)
