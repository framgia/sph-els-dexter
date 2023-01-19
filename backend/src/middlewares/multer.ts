import {s3, S3_BUCKET_NAME} from "./../configs"
import multer from "multer"
import multers3 from "multer-s3"

const bucketName: string = S3_BUCKET_NAME || ""
export const upload = multer({
  storage: multers3({
    s3: s3,
    bucket: bucketName,
    metadata: (req, file, cb) => {
      cb(null, { fieldname: file.fieldname })
    },
    key: (req, file, cb) => {
      cb(null, `profile_${Date.now()}.jpeg`)
    }
  })
})
