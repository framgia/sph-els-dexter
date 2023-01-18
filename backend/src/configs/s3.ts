import {S3Client} from "@aws-sdk/client-s3"
import {S3_ACCESS_KEY, S3_BUCKET_REGION, S3_SECRET_KEY} from "."

const accessKey: string = S3_ACCESS_KEY || ""
const secretKey: string = S3_SECRET_KEY || ""

export const s3 = new S3Client({
  region: S3_BUCKET_REGION,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey
  }
})