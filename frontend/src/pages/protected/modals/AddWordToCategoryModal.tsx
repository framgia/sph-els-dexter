import {useState, useEffect, useCallback} from "react"
import DataTable, {TableColumn} from "react-data-table-component"
import {AxiosResponse} from "axios"
import {IWord, IWordOptions, IApiResponse} from "./../../../types"
import {api} from "./../../../configs"
import {EEndpoints} from "./../../../enums"
import { useToast } from "../../../hooks"

interface ITableData {
  id?: string;
  title: string;
  description: string;
}

interface IModalData {
  id?: string;
  word: string;
}

interface IModalComponentProp {
  setIsOpen: (state: boolean) => void;
  data?: ITableData;
}

const AddWordModalContent = ({setIsOpen, data}: IModalComponentProp) => {
  const {showToast} = useToast()
  const [list, setList] = useState<IWord[]>([])

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
          <span className="cursor-pointer underline" id={row.id} onClick={() => {}}>Add word</span>
        )
      },
      name: "Action"
    }
  ]

  const dataFetch = useCallback(async () => {
    try {
      const {data: {data}}: AxiosResponse<IApiResponse<IWord[]>> = await api.get(EEndpoints.WORD_LIST)

      setList(data)
    } catch (err) {
      throw err
    }
  }, [])

  useEffect(() => {
    dataFetch()
      .catch((err: Error) => {
        console.error(err)
        showToast("error", err.message ?? "Could not fetch word list, please check the logs for more details.")
      })
  }, [dataFetch])

  return (
    <div>
      <div>{JSON.stringify(data)}</div>
      <button
        className="mt-1 bg-transparent border hover:border-transparent rounded py-2 px-4 text-sm text-black w-full rounded border hover:bg-gray-100 focus:outline-none focus:border-sky-900"
        type="button"
        onClick={() => setIsOpen(false)}
      >
        Close
      </button>
    </div>
  )
}

export default AddWordModalContent
