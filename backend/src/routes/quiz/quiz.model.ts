import {Router} from "express"
import {QuizController} from "./quiz.controller"

const router: Router = Router()

router.post("/word", QuizController.ADD_WORD)

router.post("/category", QuizController.ADD_CATEGORY)

router.post("/category/word", QuizController.ADD_CATEGORY_WORD)

router.post("/words/data", QuizController.WORD_DATA)

router.post("/start", QuizController.START_QUIZ)

router.post("/answer", QuizController.ANSWER_QUIZ)

router.get("/words/list", QuizController.WORD_LIST)

router.get("/category/list", QuizController.CATEGORY_LIST)

router.put("/category/edit", QuizController.UPDATE_CATEGORY)

router.delete("/category/delete/:id", QuizController.DELETE_CATEGORY)

export default router
