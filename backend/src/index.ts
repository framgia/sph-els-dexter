import express, {Express} from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import {PORT} from "./configs"
import {router, upload, logger} from "./middlewares"

const app: Express = express()

app.use(cors({credentials: true, origin: true}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(logger)
app.use(upload.single("image"))
router(app)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`))
