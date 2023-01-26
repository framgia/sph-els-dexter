import {Schema, model} from "mongoose"
import {IUserQuiz, IQuizProgress} from "./../types"

const schema = new Schema<IUserQuiz>({
  categoryId: String,
  userId: String,
  progress: {
    type: new Array<IQuizProgress>,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
})

export const UserQuiz = model<IUserQuiz>("UserQuiz", schema)
