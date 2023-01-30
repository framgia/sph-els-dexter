import {useEffect, useCallback, useState} from "react"
import {useParams} from "react-router-dom"
import {useSelector} from "react-redux"
import {AxiosResponse} from "axios"
import {RootState} from "./../../redux"
import {api} from "./../../configs"
import {EEndpoints} from "./../../enums"
import {IApiResponse, IWordOptions} from "./../../types"
import {useToast} from "./../../hooks"

interface IResult {
  isCorrect: boolean;
  word: string;
  studentAnswer: string;
}

const WrongIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-red-700">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

const CheckIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-green-700">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>

  )
}

const QuizResultPage = () => {
  const {showToast} = useToast()

  const {categoryid: categoryId, categoryname} = useParams<{categoryid: string; categoryname: string;}>()
  const email: string = useSelector((state: RootState): string => state.userdata.email)

  const [result, setResult] = useState<IResult[]>([])
  const [score, setScore] = useState<number>()
  const [total, setTotal] = useState<number>()

  const dataFetch = useCallback(async () => {
    try {
      const {data: {data: quizResult}}: AxiosResponse<IApiResponse<{
        result: {
          answers: {wordId: string; answer: IWordOptions}[],
          result: {score: number; total: number;}
        },
        words: {_id: string; word: string;}[]
      }>> = await api.post(EEndpoints.FETCH_RESULT, {categoryId, email})
    
      console.log(quizResult)
      const resultResponse: IResult[] = quizResult.result.answers.map(item => {
        const selectedWord = quizResult.words.find(x => x._id === item.wordId)

        return {
          isCorrect: item.answer.correctChoice,
          studentAnswer: item.answer.choice,
          word: selectedWord ? selectedWord.word : "",
        }
      })

      setResult(resultResponse)
      setScore(quizResult.result.result.score)
      setTotal(quizResult.result.result.total)
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
    <div className="w-full flex flex-col px-64 py-12">
      <div className="flex justify-between px-28 pb-6 border-b">
        <label htmlFor="categoryname" className="text-2xl font-bold">{categoryname}</label>
        <label htmlFor="result" className="text-2xl font-bold">Result : {score} of {total}</label>
      </div>
      <div className="w-full mt-3 px-28">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-sm text-black uppercase">
              <tr>
                <th scope="col" className="px-6 py-3"></th>
                <th scope="col" className="px-6 py-3 font-bold">Word</th>
                <th scope="col" className="px-6 py-3 font-bold">Answer</th>
              </tr>
            </thead>
            <tbody>
              {
                result.length ? (
                  result.map((res: IResult, index: number) => (
                    <tr className="bg-white" key={index}>
                      <th scope="row" className="px-6 py-4 font-medium text-black whitespace-nowrap">
                        {res.isCorrect ? <CheckIcon /> : <WrongIcon />}
                      </th>
                      <td className="px-6 py-4 font-medium text-black whitespace-nowrap">
                        {res.word}
                      </td>
                      <td className="px-6 py-4 font-medium text-black whitespace-nowrap">
                        {res.studentAnswer}
                      </td>
                    </tr>
                  ))
                ) : null
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default QuizResultPage
