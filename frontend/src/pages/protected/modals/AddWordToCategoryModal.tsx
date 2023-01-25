import {useState, useEffect, useCallback} from "react"
import DataTable, {TableColumn} from "react-data-table-component"
import {AxiosResponse} from "axios"
import {LoadingIndicator} from "./../../../components"
import {IWord, IApiResponse} from "./../../../types"
import {api} from "./../../../configs"
import {EEndpoints} from "./../../../enums"
import {useToast} from "../../../hooks"

interface ITableData {
  _id?: string;
  title: string;
  description: string;
  words?: string[];
}

interface IModalData {
  _id?: string;
  word: string;
}

interface IModalData {
  id?: string;
  word: string;
}

interface IModalComponentProp {
  setIsOpen: (state: boolean) => void;
  data?: ITableData;
  newWordAdded: (categoryId?: string, wordId?: string) => void;
}

const AddWordModalContent = ({setIsOpen, data, newWordAdded}: IModalComponentProp) => {
  const {showToast} = useToast()

  const [list, setList] = useState<IWord[]>([])
  const [tableList, setTableList] = useState<IWord[]>([])

  const [processing, setProcessing] = useState<boolean>(false)
  const [searchWord, setSearchWord] = useState<string>("")
  const [submitted, setSubmitted] = useState<boolean>(false)

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "rgb(243 244 246)"
      },
    }
  }

  const columns: TableColumn<IModalData>[] = [
    {
      name: "Word",
      selector: row => row.word
    },
    {
      cell: row => {
        return (
          <span 
            className="cursor-pointer underline" 
            id={row._id} 
            onClick={() => addWord({
              categoryId: data?._id,
              wordId: row._id,
              words: data?.words
            })}
          >
            {submitted ? <LoadingIndicator /> : "Add word"}
          </span>
        )
      },
      name: "Action"
    }
  ]

  const addWord = async ({categoryId, wordId, words}: {categoryId?: string; wordId?: string; words?: string[]}) => {
    setSubmitted(true)

    try {
      const wordPayload = words ? [...words, wordId] : [wordId]
      const payload = {
        categoryId,
        words: wordPayload
      }

      const {data: {message}}: AxiosResponse<IApiResponse<never>> = await api.post(EEndpoints.ADD_CATEGORY_WORD, {...payload})
      
      newWordAdded(categoryId, wordId)

      const [finalList, finalTableList] = [
        list.filter((item: IWord) => {
          if (!item._id) return item
          
          return !data?.words?.includes(item._id)
        }),
        tableList.filter((item: IWord) => {
          if (!item._id) return item
          
          return !data?.words?.includes(item._id)
        })
      ]

      setList(finalList)
      setTableList(finalTableList)

      setSubmitted(false)
      showToast("success", message)
    } catch (err) {
      const error: Error = err as Error

      console.error(err)
      setSubmitted(false)
      showToast("error", error.message ?? "Word not added, please check the logs for more details.")
    }
  }

  const dataFetch = useCallback(async () => {
    setProcessing(true)
    try {
      const {data: {data: wordListResponse}}: AxiosResponse<IApiResponse<IWord[]>> = await api.get(EEndpoints.WORD_LIST)

      const finalList = wordListResponse.filter((item: IWord) => {
        if (!item._id) return item
        
        return !data?.words?.includes(item._id)
      })

      setList(finalList)
      setTableList(finalList)
      setProcessing(false)
    } catch (err) {
      setProcessing(false)
      throw err
    }
  }, [])

  useEffect(() => {
    if (searchWord)  {
      setTableList([...list].filter((item: IWord) => item.word.toLowerCase().includes(searchWord.toLowerCase())))
    } else {
      setTableList(list)
    }
  }, [searchWord])

  useEffect(() => {
    dataFetch()
      .catch((err: Error) => {
        console.error(err)
        showToast("error", err.message ?? "Could not fetch word list, please check the logs for more details.")
      })
  }, [dataFetch])

  return (
    <div className="w-full flex flex-col">
      <div className="pb-1 border-b">
        <span className="font-semibold trailing mb-2">Add word for {data?.title}</span>
      </div>
      <input 
        className="w-full p-2 border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-2 mt-2" 
        type="text" 
        placeholder="Search for a word.."
        onInput={(e) => setSearchWord(e.currentTarget.value)} 
      />
      <DataTable 
        columns={columns}
        data={tableList}
        progressPending={processing}
        customStyles={customStyles}
        fixedHeader
        pagination
      />
      <div className="flex justify-end">
        <button 
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          onClick={() => setIsOpen(false)}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default AddWordModalContent
