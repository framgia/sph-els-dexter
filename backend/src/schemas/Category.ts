import {Schema, model} from "mongoose"
import {ICategory} from "./../types"

const schema = new Schema<ICategory>({
  title: String,
  description: String,
  status: {
    type: String,
    default: "active"
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  createdBy: {
    type: String,
    default: ""
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  },
  updatedBy: {
    type: String,
    default: ""
  }
})

export const Category = model("Category", schema)
