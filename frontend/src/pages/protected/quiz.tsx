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

interface ILocalData {
  categoryId: string;
  email: string;
  progress: IQuizProgress[];
}

const QuizPage = () => {
  const {categoryid: categoryId, categoryname: categoryName} = useParams()

  const navigate = useNavigate()
  const {showToast} = useToast()

  const email: string = useSelector((state: RootState): string => state.userdata.email)

  const [showFinishBtn, setShowFinishBtn] = useState<boolean>(false)
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
    unansweredWords: [],
    answers: []
  })
  
  const displayIndex: number = 0  /** To control the display */

  const optionListStyle: string = `
    mb-2 w-full px-4 py-2 
    border text-white rounded-lg
    cursor-pointer flex justify-between
  `

  const finishQuiz = async () => {
    try {
      setProcessing(true)

      const localData: string | null = localStorage.getItem("progress")

      if (!localData) throw new Error("Local progress is wiped out from local storage.")

      const data: ILocalData | undefined = (JSON.parse(localData) as ILocalData[])
                                          .find((x: ILocalData) => x.categoryId === categoryId && x.email === email)

      if (!data) throw new Error("Local progress is wiped out from local storage.")

      const localProgress: IQuizProgress[] = data.progress
      const payload = {
        categoryId,
        email,
        progress: localProgress
      }

      const {data: {message}}: AxiosResponse<IApiResponse<never>> = await api.post(EEndpoints.SUBMIT_QUIZ, {...payload})

      const parsedData: ILocalData[] = JSON.parse(localData)
      parsedData.splice(parsedData.findIndex((x: ILocalData) => x.categoryId === categoryId && x.email === email))

      console.log(parsedData)
      localStorage.setItem("progress", JSON.stringify(parsedData))

      setProcessing(false)
      showToast("success", message)
      
      navigate(`${ERouteNames.QUIZ_RESULT}/${categoryId}/${categoryName}`)
    } catch (err) {
      const error: Error = err as Error
      setProcessing(false)

      console.error(err)
      showToast("error", error.message ?? "Your request could not be processed, please check the logs for more details.")
    }
  }

  const selectAnswer = (question: IWord, optionSelected: IWordOptions) => {
    setSelectedOption(optionSelected.id)
    setProcessing(true)

    const unAnsweredQuestions: IWord[] = questions.filter((item: IWord) => item._id !== question._id)
    
    const progressData: IQuizProgress = {
      answeredAt: new Date(),
      answers: [...progress!.answers, {wordId: question._id!, answer: optionSelected}],
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

    if (progressData.unansweredWords.length === 0) {
      setShowFinishBtn(true)
    }

    setProgress(progressData)

    const localProgress = localStorage.getItem("progress")

    if (!localProgress) {
      localStorage.setItem("progress", JSON.stringify([{
        categoryId,
        email,
        progress: progressData
      }]))
    } else {
      const localData: ILocalData[] = JSON.parse(localProgress) as ILocalData[]
      const parsed: ILocalData | undefined = localData.find((x: ILocalData) => x.categoryId === categoryId && x.email === email)
      
      if (parsed) {
        const updatedProgress: IQuizProgress[] = parsed.progress.map((data: IQuizProgress) => {
          data.latestProgress = false

          return data
        })

        localStorage.setItem("progress", JSON.stringify([
          ...localData.map((x: ILocalData) => {
            if (x.categoryId === categoryId && x.email === email) {
              x.progress = [...updatedProgress, progressData]
            }

            return x
          })
        ]))
      }
    }
    
    setSelectedOption(undefined)
    setQuestions(unAnsweredQuestions)
    setProcessing(false)

    showToast("success", "Answer is saved.")
  }

  const dataFetch = useCallback(async () => {
    try {
      const {data: {data}}: AxiosResponse<IApiResponse<{
        progress: IQuizProgress;
        totalQuestions: number;
        words: IWord[];
      }>> = await api.post(EEndpoints.START_QUIZ, {
        categoryId,
        email
      })

      const localData: string | null = localStorage.getItem("progress")
      
      if (!localData) {
        localStorage.setItem("progress", JSON.stringify([{
          categoryId,
          email,
          progress: [data.progress]
        }]))
      } else {
        const parsedData: ILocalData[] = JSON.parse(localData) as ILocalData[]
        const localStorageData: ILocalData | undefined = parsedData.find((x: ILocalData) => x.categoryId === categoryId && x.email === email)
  
        if (localStorageData) {
          const localProgress: IQuizProgress | undefined = localStorageData["progress"].find((x: IQuizProgress) => x.latestProgress)

          if (localProgress) {
            const answeredWords: string[] = localProgress.correctAnsweredWords && localProgress.incorrectAnsweredWords
              ? [...localProgress.correctAnsweredWords, ...localProgress.incorrectAnsweredWords]
              : []
    
            setProgress(localProgress)
            setNumberOfQuestions(data.totalQuestions)
    
            if (!localProgress.unansweredWords.length) {
              setShowFinishBtn(true)
            }

            if (answeredWords.length) {
              setQuestions([
                ...data.words.filter((item: IWord) => item && item._id ? !answeredWords.includes(item._id) : false)
              ])
            } else {
              setQuestions(data.words)
            }
          }
        } else {
          localStorage.setItem("progress", JSON.stringify([
            ...parsedData,
            {
              categoryId,
              email,
              progress: [data.progress]
            }
          ]))
        }
      }

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
    <>
      {
        questions.length ? (
          <div className="w-full px-96 py-20">
            <div className="flex flex-col">
              <div className="w-full flex">
                <div className="w-1/2 flex justify-center">
                  <span className="font-bold text-xl">{categoryName}</span>
                </div>
                <div className="w-1/2 flex justify-end">
                  <span className="font-bold text-xl">
                    {((progress.correctAnsweredWords.length+progress.incorrectAnsweredWords.length)+1) <= numberOfQuestions ? (progress.correctAnsweredWords.length+progress.incorrectAnsweredWords.length)+1 : numberOfQuestions} of {numberOfQuestions}
                  </span>
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
      {
        showFinishBtn ? (
          <div className="w-full flex justify-center items-center">
            <div className="w-1/3 flex justify-center items center py-4">
              <div className="flex flex-col w-full mt-4 py-4">
                <div className="w-full flex justify-center items center py-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-green-800">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="ml-3 text-green-800">Quiz completed, press the button to submit the result.</span> 
                  </div>
                </div>
                <div className="w-full py-4 border-t">
                  <button
                    className="bg-sky-800 py-2 px-4 text-sm text-white w-full rounded border hover:bg-sky-900 focus:outline-none focus:border-sky-900"
                    type="button"
                    disabled={processing}
                    onClick={finishQuiz}
                  >
                    {processing ? <LoadingIndicator /> : "Finish"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null
      }
    </>
  )
}

export default QuizPage
