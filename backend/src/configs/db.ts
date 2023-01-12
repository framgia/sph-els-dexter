import {MongoClient, ServerApiVersion} from "mongodb"
import {MONGO_USERNAME, MONGO_PASSWORD, CLUSTERNAME} from '.'

const uri: string = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${CLUSTERNAME}.4j9qexb.mongodb.net/?retryWrites=true&w=majority`

export const client: MongoClient = new MongoClient(uri, { serverApi: ServerApiVersion.v1 })