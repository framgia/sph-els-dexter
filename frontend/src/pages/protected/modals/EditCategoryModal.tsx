import {useState, useEffect, useCallback} from "react"
import DataTable, {TableColumn} from "react-data-table-component"
import {useForm, SubmitHandler} from "react-hook-form"
import {AxiosResponse} from "axios"
import {IApiResponse} from "./../../../types"
import {useToast} from "./../../../hooks"
import {api} from "./../../../configs"
import {EEndpoints} from "./../../../enums"
import {Input, LoadingIndicator} from "./../../../components"

const customStyles = {
  headCells: {
    style: {
      backgroundColor: "rgb(243 244 246)"
    },
  }
}

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

interface IModalComponentProp {
  setIsOpen: (state: boolean) => void;
  data?: ITableData;
  updatedWords: (categoryId?: string, words?: string[]) => void;
}

const EditCategoryModalContent = ({setIsOpen, data, updatedWords}: IModalComponentProp) => {
  const {showToast} = useToast()
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [processing, setProcessing] = useState<boolean>(false)

  const [tableData, setTableData] = useState<IModalData[]>([])
  const [filteredData, setFilteredData] = useState<IModalData[]>([])

  const [searchWord, setSearchWord] = useState<string>("")

  const {register, handleSubmit} = useForm<ITableData>({
    defaultValues: {
      title: data?.title,
      description: data?.description
    }
  })

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
            onClick={() => submitted ? null : removeWord(row._id)}
          >
            {submitted ? <LoadingIndicator /> : "Remove word"}
          </span>
        )
      },
      name: "Action"
    }
  ]

  const removeWord = (id?: string) => {
    setFilteredData([
      ...filteredData.filter((item: IModalData) => item._id !== id)
    ])
    setTableData([
      ...tableData.filter((item: IModalData) => item._id !== id)
    ])
  }

  const submit: SubmitHandler<ITableData> = async (formData: ITableData) => {
    setSubmitted(true)
    const finalWords: string[] = filteredData.map((item: IModalData) => item._id) as string[]

    if (
      formData.title.toLowerCase() === data?.title.toLowerCase() &&
      formData.description.toLowerCase() === data?.description.toLowerCase() &&
      finalWords.length === data.words?.length
    ) {
      setSubmitted(false)
      setIsOpen(false)
    } else {
      const payload = {
        ...formData,
        categoryId: data?._id,
        words: finalWords
      }

      try {
        const {data: {message}}: AxiosResponse<IApiResponse<never>> = await api.put(EEndpoints.UPDATE_CATEGORY, {...payload})
      
        updatedWords(data?._id, finalWords)
        setSubmitted(false)
        showToast("success", message)

        setIsOpen(false)
      } catch (err) {
        const error: Error = err as Error
        console.error(err)

        setSubmitted(false)
        showToast("error", error.message ?? "Could not update the category, please check the logs for more details.")
      }
    }
  }

  const dataFetch = useCallback(async () => {
    setProcessing(true)

    try {
      const {data: {data: wordData}}: AxiosResponse<IApiResponse<IModalData[]>> = await api.post(EEndpoints.GET_WORD_DATA, {words: data?.words})
      
      setTableData(wordData)
      setFilteredData(wordData)
      
      setProcessing(false)
    } catch (err) {
      setProcessing(false)
      throw err
    }
  }, [])

  useEffect(() => {
    dataFetch()
      .catch((err: Error) => {
        showToast("error", err.message ?? "Could not fetch the data for the words.")
      })
  }, [dataFetch])

  useEffect(() => {
    if (searchWord) {
      setFilteredData([
        ...tableData.filter((item: IModalData) => item.word.toLowerCase().includes(searchWord.toLowerCase()))
      ])
    } else {
      setFilteredData(tableData)
    }
  }, [searchWord])

  return (
    <div className="w-full flex flex-col">
      <div className="pb-1 border-b">
        <span className="font-semibold trailing mb-2">Edit {data?.title} category</span>
      </div>
      <div className="flex p-2 mt-2">
        <form onSubmit={handleSubmit(submit)} className="p-2">
          <Input 
            hasLabel={true}
            label="Title"
            type="text"
            name="title"
            placeholder="Category title"
            register={register}
            rules={{required: true}}
          />
          <Input
            hasLabel={true}
            label="Description"
            type="text"
            name="description"
            placeholder="Category description"
            register={register}
            rules={{required: true}}
          />
          <div className="flex justify-center items-center mt-3">
            <div className="flex flex-col w-full">
              <button
                className="bg-sky-800 py-2 px-4 text-sm text-white w-full rounded border hover:bg-sky-900 focus:outline-none focus:border-sky-900"
                type="submit"
              >
                {submitted ? <LoadingIndicator /> : "Submit"}
              </button>
              <button
                className="mt-1 bg-transparent border hover:border-transparent rounded py-2 px-4 text-sm text-black w-full rounded border hover:bg-gray-100 focus:outline-none focus:border-sky-900"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </form>
        <div className="flex flex-col">
          <input 
            className="w-full p-2 border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-2 mt-2" 
            type="text" 
            placeholder="Search for a word.."
            onInput={(e) => setSearchWord(e.currentTarget.value)} 
          />
          <DataTable 
            columns={columns}
            data={filteredData}
            progressPending={processing}
            customStyles={customStyles}
            fixedHeader
            pagination
          />
        </div>
      </div>
    </div>
  )
}

export default EditCategoryModalContent
