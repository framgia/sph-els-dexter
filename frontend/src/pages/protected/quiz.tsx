import {useEffect, useCallback, useState} from "react"
import {useSelector} from "react-redux"
import {AxiosResponse} from "axios"
import {useParams} from "react-router-dom"
import {IApiResponse, IQuizProgress, IWord, IWordOptions} from "./../../types"
import {api} from "./../../configs"
import {RootState} from "./../../redux"
import {EEndpoints} from "../../enums"
import {useToast} from "./../../hooks"

const QuizPage = () => {
  const {categoryid: categoryId, categoryname: categoryName} = useParams()
  const {showToast} = useToast()

  const email: string = useSelector((state: RootState): string => state.userdata.email)

  const [questions, setQuestions] = useState<IWord[]>([])
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(0)
  
  const displayIndex: number = 0  /** To control the display */
  let progress: IQuizProgress = {
    answeredAt: new Date(),
    correctAnsweredWords: [],
    currentScore: 0,
    latestProgress: true,
    unansweredWords: []
  }

  const optionListStyle: string = "mb-2 w-full px-4 py-2 border bg-blue-500 hover:bg-blue-800 text-white border-blue-500 rounded-lg dark:border-blue-600 cursor-pointer"

  const selectAnswer = (question: IWord, optionSelected: IWordOptions) => {
    const unAnsweredQuestions: IWord[] = questions.filter((item: IWord) => item._id !== question._id)

    progress = {
      answeredAt: new Date(),
      correctAnsweredWords: optionSelected.correctChoice 
        ? [...progress!.correctAnsweredWords, question._id] as string[]
        : [...progress!.correctAnsweredWords],
      currentScore: optionSelected.correctChoice
        ? progress!.currentScore+1
        : progress!.currentScore || 0,
        unansweredWords: unAnsweredQuestions.map((item: IWord) => item._id) as string[],
        latestProgress: true
    }

    setQuestions(unAnsweredQuestions)
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

      const answeredWords: string[] = data.progress.correctAnsweredWords
      
      progress = data.progress
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
                            className={optionListStyle} 
                            key={option.id}
                            onClick={() => selectAnswer(item, option)}
                          >
                            {option.choice}
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
  )
}

export default QuizPage
