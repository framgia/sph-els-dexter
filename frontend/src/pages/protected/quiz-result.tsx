import {useEffect, useCallback} from "react"
import {useParams} from "react-router-dom"
import {useSelector} from "react-redux"
import {AxiosResponse} from "axios"
import {RootState} from "./../../redux"
import {api} from "./../../configs"
import {EEndpoints} from "./../../enums"
import {IApiResponse} from "./../../types"
import {useToast} from "./../../hooks"

const QuizResultPage = () => {
  const {showToast} = useToast()

  const {categoryid: categoryId, categoryname} = useParams<{categoryid: string; categoryname: string;}>()
  const email: string = useSelector((state: RootState): string => state.userdata.email)

  const dataFetch = useCallback(async () => {
    try {
      const {data: {data: quizResult, message}}: AxiosResponse<IApiResponse<never>> = await api.post(EEndpoints.FETCH_RESULT, {categoryId, email})
    
      console.log("Quiz result", quizResult)
      showToast("success", message)
    } catch (err) {
      throw err
    }
  }, [])

  useEffect(() => {
    dataFetch()
      .catch((err: Error) => {
        console.error(err)

        showToast("error", err.message)
      })
  }, [dataFetch])
  return (
    <div>This is the quiz result page.</div>
  )
}

export default QuizResultPage
