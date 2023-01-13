import {connect, connection, set} from "mongoose"
import {MONGO_USERNAME, MONGO_PASSWORD, CLUSTERNAME, DATABASE_NAME} from '.'

set("strictQuery", true)
const uri: string = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${CLUSTERNAME}.4j9qexb.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`

connect(uri)
export const client = connection
