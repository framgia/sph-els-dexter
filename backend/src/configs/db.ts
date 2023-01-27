import {connect, connection, set} from "mongoose"
import {MONGO_USERNAME, MONGO_PASSWORD, CLUSTERNAME, DATABASE_NAME} from '.'
import {NODE_ENV} from "./../configs"
import {EEnvironment} from "./../enums"

set("strictQuery", true)
const uri: string = NODE_ENV && NODE_ENV === EEnvironment.DEVELOPMENT
  ? `mongodb://127.0.0.1:27017/${DATABASE_NAME}?retryWrites=true&w=majority`
  : `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${CLUSTERNAME}.4j9qexb.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`

connect(uri)
export const client = connection
