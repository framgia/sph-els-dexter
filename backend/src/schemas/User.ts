import {Schema, model} from "mongoose";
import {IUser} from "./../types"
import {hashPassword} from "./../utils"

const schema = new Schema<IUser>({
  name: String,
  avatar: String,
  email: String,
  password: String,
  role: {
    type: Number,
    default: 0
  },
  auditTrail: {
    type: Array,
    default: []
  },
  followers: {
    type: Array,
    default: []
  },
  following: {
    type: Array,
    default: []
  },
  wordsLearned: {
    type: Array,
    default: []
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

schema.pre("save", function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = hashPassword(user.password) as string
  }
  
  next()
})

export const User = model<IUser>('User', schema)
