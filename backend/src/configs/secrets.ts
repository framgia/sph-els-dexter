import {config} from "dotenv"
config()

export const PORT: string | undefined = process.env.DEV_PORT
export const SALTROUND: string | undefined = process.env.SALTROUND
export const NODE_ENV: string | undefined = process.env.NODE_ENV

/** JWT Secret */
export const ACCESS_TOKEN_SECRET: string | undefined = process.env.ACCESS_TOKEN_SECRET
export const REFRESH_TOKEN_SECRET: string | undefined = process.env.REFRESH_TOKEN_SECRET

/** Database Config */
export const MONGO_USERNAME: string | undefined = process.env.MONGO_USERNAME
export const MONGO_PASSWORD: string | undefined = process.env.MONGO_PASSWORD
export const CLUSTERNAME: string | undefined = process.env.CLUSTER_NAME
export const DATABASE_NAME: string | undefined = process.env.DATABASE_NAME

/** S3 */
export const S3_ACCESS_KEY: string | undefined = process.env.S3_ACCESS_KEY
export const S3_SECRET_KEY: string | undefined = process.env.S3_SECRET_KEY
export const S3_BUCKET_REGION: string | undefined = process.env.S3_BUCKET_REGION
export const S3_BUCKET_NAME: string | undefined = process.env.S3_BUCKET_NAME
export const S3_DEFAULT_IMAGE: string | undefined = process.env.S3_DEFAULT_IMAGE
