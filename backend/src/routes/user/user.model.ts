import {Router} from "express"
import {UserController} from "./user.controller"

const router: Router = Router()

router.post("/create", UserController.CREATE_USER)

router.post("/login", UserController.LOGIN)

export default router
