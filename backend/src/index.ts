import express, {Express} from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import {PORT} from "./configs"
import {
  router, upload, logger, 
  setAuthorizationHeader,
  authenticateToken
} from "./middlewares"

const app: Express = express()

app.use(cors({credentials: true, origin: true}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(upload.single("image"))
app.use(setAuthorizationHeader) /** <-- Setting up auth header if cookie header is present */
app.use(authenticateToken)      /** <-- Authenticate the validity of the token */
app.use(logger)

router(app)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`))
