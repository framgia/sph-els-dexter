import {useEffect, useCallback, useState} from "react"
import {useSelector} from "react-redux"
import {AxiosResponse} from "axios"
import {useParams, useNavigate} from "react-router-dom"
import {IApiResponse, IQuizProgress, IWord, IWordOptions} from "./../../types"
import {api} from "./../../configs"
import {RootState} from "./../../redux"
import {EEndpoints, ERouteNames} from "../../enums"
import {useToast} from "./../../hooks"
import {LoadingIndicator} from "./../../components"

const QuizPage = () => {
  const {categoryid: categoryId, categoryname: categoryName} = useParams()

  const navigate = useNavigate()
  const {showToast} = useToast()

  const email: string = useSelector((state: RootState): string => state.userdata.email)

  const [selectedOption, setSelectedOption] = useState<number | undefined>(undefined)
  const [processing, setProcessing] = useState<boolean>(false)
  const [questions, setQuestions] = useState<IWord[]>([])
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(0)
  const [progress, setProgress] = useState<IQuizProgress>({
    answeredAt: new Date(),
    correctAnsweredWords: [],
    incorrectAnsweredWords: [],
    currentScore: 0,
    latestProgress: true,
    unansweredWords: []
  })
  
  const displayIndex: number = 0  /** To control the display */

  const optionListStyle: string = `
    mb-2 w-full px-4 py-2 
    border text-white rounded-lg
    cursor-pointer flex justify-between
  `

  const selectAnswer = async (question: IWord, optionSelected: IWordOptions) => {
    try {
      setSelectedOption(optionSelected.id)
      setProcessing(true)

      const unAnsweredQuestions: IWord[] = questions.filter((item: IWord) => item._id !== question._id)
      console.log("progress", progress)
      const progressData: IQuizProgress = {
        answeredAt: new Date(),
        correctAnsweredWords: optionSelected.correctChoice 
          ? [...progress!.correctAnsweredWords, question._id] as string[]
          : [...progress!.correctAnsweredWords],
        incorrectAnsweredWords: optionSelected.correctChoice
          ? [...progress!.incorrectAnsweredWords]
          : [...progress!.incorrectAnsweredWords, question._id] as string[],
        currentScore: optionSelected.correctChoice
          ? progress!.currentScore+1
          : progress!.currentScore || 0,
          unansweredWords: unAnsweredQuestions.map((item: IWord) => item._id) as string[],
          latestProgress: true
      }

      setProgress(progressData)

      console.log(progressData, optionSelected.correctChoice, question._id)

      const payload = {
        categoryId,
        email,
        progress: progressData
      }

      const {data: {message}}: AxiosResponse<IApiResponse<never>> = await api.post(EEndpoints.ANSWER_QUIZ, {...payload})

      setSelectedOption(undefined)
      setQuestions(unAnsweredQuestions)
      setProcessing(false)

      if (unAnsweredQuestions.length) {
        showToast("success", message)
      } else {
        showToast("success", "All questions have been completely answered.")
        /** Should navigate to the result page */
        navigate(ERouteNames.CATEGORY_PAGE)
      }
    } catch (err) {
      const error: Error = err as Error

      console.error(err)
      showToast("error", error.message ?? "Something went wrong during the request, please check the logs for more details.")
    }
  }

  const dataFetch = useCallback(async () => {
    try {
      const {data: {data}}: AxiosResponse<IApiResponse<{
        progress: IQuizProgress;
        words: IWord[]
      }>> = await api.post(EEndpoints.START_QUIZ, {
        categoryId,
        email
      })

      const answeredWords: string[] = data.progress && data.progress.correctAnsweredWords
        ? data.progress.correctAnsweredWords
        : []
      
      setProgress(data.progress)
      setNumberOfQuestions(data.words.length)

      if (answeredWords.length) {
        setQuestions([
          ...data.words.filter((item: IWord) => item && item._id ? !answeredWords.includes(item._id) : false)
        ])
      } else {
        setQuestions(data.words)
      }
    } catch (err) {
      throw err
    }
  }, [])

  useEffect(() => {
    console.log("Progress is updated.", progress)
  }, [progress])

  useEffect(() => {
    dataFetch()
      .catch((err: Error) => {
        console.error(err)
        showToast("error", err.message ?? "There was an error fetching the questions, please check the logs for more details.")
      })
  }, [dataFetch])

  return questions.length ? (
    <div className="w-full px-96 py-20">
      <div className="flex flex-col">
        <div className="w-full flex">
          <div className="w-1/2 flex justify-center">
            <span className="font-bold text-xl">{categoryName}</span>
          </div>
          <div className="w-1/2 flex justify-end">
            <span className="font-bold text-xl">{(numberOfQuestions-questions.length)+1} of {numberOfQuestions}</span>
          </div>
        </div>
        {
          questions.length ? (
            questions.map((item: IWord, index: number) => displayIndex === index ? (
              <div className="w-full flex mt-4" key={item._id}>
                <div className="w-1/2 flex justify-center items-center">
                  <span className="font-semibold text-xl">{item.word}</span>
                </div>
                <div className="w-1/2">
                  <div className="flex flex-col items-center w-full">
                    {
                      item.options?.length ? (
                        item.options.map((option: IWordOptions) => (
                          <span 
                            className={
                              processing
                                ? selectedOption && selectedOption === option.id
                                ? `bg-blue-800 border-blue-800 dark:border-blue-800 ${optionListStyle}`
                                : `bg-blue-500 border-blue-500 dark:border-blue-600 ${optionListStyle}`
                                : `bg-blue-500 border-blue-500 dark:border-blue-600 hover:bg-blue-800 ${optionListStyle}`
                            } 
                            key={option.id}
                            onClick={() => processing ? null : selectAnswer(item, option)}
                          >
                            {option.choice} {
                              processing 
                                ? selectedOption && selectedOption === option.id
                                ? <LoadingIndicator />
                                : null 
                                : null
                              }
                          </span>
                        ))
                      ) : null
                    }
                  </div>
                </div>
              </div>
            ) : null)
          ) : null
        }
      </div>
    </div>
  ) : null
}

export default QuizPage
