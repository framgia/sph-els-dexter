import {Router} from "express"
import {QuizController} from "./quiz.controller"

const router: Router = Router()

router.post("/word", QuizController.ADD_WORD)

router.post("/category", QuizController.ADD_CATEGORY)

export default router
