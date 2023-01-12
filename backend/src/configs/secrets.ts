import {config} from "dotenv"
config()

export const PORT: string | undefined = process.env.DEV_PORT
export const MONGO_USERNAME: string | undefined = process.env.MONGO_USERNAME
export const MONGO_PASSWORD: string | undefined = process.env.MONGO_PASSWORD
export const CLUSTERNAME: string | undefined = process.env.CLUSTER_NAME