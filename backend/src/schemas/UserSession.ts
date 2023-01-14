import {Schema, model} from "mongoose"
import {IUserSession} from "./../types"

const schema = new Schema<IUserSession>({
  userId: String,
  sessionToken: {
    type: String,
    default: null
  },
  createdAt: {
    type: String,
    default: Date.now()
  },
  updatedAt: {
    type: String,
    default: Date.now()
  }
})

export const UserSession = model<IUserSession>("UserSession", schema)