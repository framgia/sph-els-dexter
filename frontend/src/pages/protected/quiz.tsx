import {useEffect, useCallback, useState} from "react"
import {useSelector} from "react-redux"
import {AxiosResponse} from "axios"
import {useParams} from "react-router-dom"
import {IApiResponse, IQuizProgress, IWord} from "./../../types"
import {api} from "./../../configs"
import {RootState} from "./../../redux"
import {EEndpoints} from "../../enums"
import {useToast} from "./../../hooks"

const QuizPage = () => {
  const {categoryid: categoryId, categoryname: categoryName} = useParams()
  const {showToast} = useToast()

  const email: string = useSelector((state: RootState): string => state.userdata.email)

  const [progress, setProgress] = useState<IQuizProgress>()
  const [questions, setQuestions] = useState<IWord[]>([])
  const [pendingQuestions, setPendingQuestions] = useState<IWord[]>([])

  const optionListStyle: string = "mb-2 w-full px-4 py-2 border bg-blue-500 hover:bg-blue-800 text-white border-blue-500 rounded-lg dark:border-blue-600 cursor-pointer"

  const dataFetch = useCallback(async () => {
    try {
      const {data: {data}}: AxiosResponse<IApiResponse<{
        progress: IQuizProgress;
        words: IWord[]
      }>> = await api.post(EEndpoints.START_QUIZ, {
        categoryId,
        email
      })

      setProgress(data.progress)
      setQuestions(data.words)
    } catch (err) {
      throw err
    }
  }, [])

  useEffect(() => {
    dataFetch()
      .catch((err: Error) => {
        console.error(err)
        showToast("error", err.message ?? "There was an error fetching the questions, please check the logs for more details.")
      })
  }, [dataFetch])

  return (
    <div className="w-full px-96 py-20">
      <div className="flex flex-col">
        <div className="w-full flex">
          <div className="w-1/2 flex justify-center">
            <span className="font-bold text-xl">{categoryName}</span>
          </div>
          <div className="w-1/2 flex justify-end">
            <span className="font-bold text-xl">3 of 20</span>
          </div>
        </div>
        <div className="w-full flex">
          <div className="w-1/2 flex justify-center pt-20">
            <span className="font-semibold text-xl">Word</span>
          </div>
          <div className="w-1/2">
            <div className="mt-6 flex flex-col w-full">
              <span className={optionListStyle}>Option 1</span>
              <span className={optionListStyle}>Option 2</span>
              <span className={optionListStyle}>Option 3</span>
              <span className={optionListStyle}>Option 4</span>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex justify-between">
        <div className="w-1/2 flex flex-col">
          <div className="w-full flex justify-center">
            <span className="font-bold text-xl capitalize">{categoryName}</span>
          </div>
          <div className="w-full flex justify-center py-20">
            <span className="font-semibold">Word</span>
          </div>
        </div>
        <div className="w-1/2 flex flex-col">
          <div className="w-full flex justify-end">
            <span className="font-bold text-xl">3 of 20</span>
          </div>
          <div className="mt-6 flex flex-col w-full">
            <span className={optionListStyle}>Option 1</span>
            <span className={optionListStyle}>Option 2</span>
            <span className={optionListStyle}>Option 3</span>
            <span className={optionListStyle}>Option 4</span>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default QuizPage
