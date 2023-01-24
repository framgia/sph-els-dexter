import {Schema, model} from "mongoose"
import {IWord, IWordOptions} from "./../types"

const schema = new Schema<IWord>({
  _id: String,
  word: String,
  options: {
    type: new Array<IWordOptions>,
    default: [
      {
        choice: "",
        correctChoice: false,
        id: 1
      }
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  },
  createdBy: {
    type: String,
    default: ""
  },
  updatedBy: {
    type: String,
    default: ""
  }
})

export const Word = model<IWord>("Word", schema)
