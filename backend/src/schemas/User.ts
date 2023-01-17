import {Schema, model} from "mongoose";
import {IUser} from "./../types"

const schema = new Schema<IUser>({
  name: String,
  avatar: String,
  email: String,
  password: String,
  role: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Number,
    default: Date.now()
  },
  updatedAt: {
    type: Number,
    default: Date.now()
  }
})

export const User = model<IUser>('User', schema)
