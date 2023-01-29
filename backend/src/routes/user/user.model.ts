import {Router} from "express"
import {UserController} from "./user.controller"

const router: Router = Router()

router.post("/create", UserController.CREATE_USER)

router.post("/login", UserController.LOGIN)

router.post("/logout", UserController.LOGOUT)

router.post("/auditlog", UserController.AUDIT_LOG)

router.post("/social", UserController.SOCIAL)

export default router
