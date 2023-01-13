import {Schema} from "mongoose";

export const userSchema = new Schema({
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
