import {useState} from "react"
import DataTable, {TableColumn} from "react-data-table-component"
import Modal from "react-modal"
import {useForm, SubmitHandler} from "react-hook-form"
import {AxiosResponse} from "axios"
import {IApiResponse} from "./../../../types"
import {useToast} from "./../../../hooks"
import {Input, LoadingIndicator} from "./../../../components"
import {EEndpoints} from "./../../../enums"
import {api} from "./../../../configs"

interface ITableData {
  id?: string;
  title: string;
  description: string;
}

interface ICategoryPayload {
  title: string;
  description: string;
}

const modalStyle = {
  overlay: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    zIndex: 9999
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

const columns: TableColumn<ITableData>[] = [
  {
    name: "Title",
    selector: row => row.title
  },
  {
    name: "Description",
    selector: row => row.description
  },
  {
    cell: row => {
      return (
        <div className="flex">
          <span className="cursor-pointer underline" id={row.id}>Add word</span>
          &nbsp;|&nbsp;
          <span className="cursor-pointer underline" id={row.id}>Edit</span>
          &nbsp;|&nbsp;
          <span className="cursor-pointer underline" id={row.id}>Delete</span>
        </div>
      )
    },
    name: "Action"
  }
]

const data = [
  {
    id: "1",
    title: "Title 1",
    description: "Description 1"
  },
  {
    id: "2",
    title: "Title 2",
    description: "Description 2"
  },
  {
    id: "3",
    title: "Title 3",
    description: "Description 3"
  }
]


const AdminCategoryPage = () => {
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [processing, setProcessing] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const {showToast} = useToast()

  const {
    register: categoryFormRegister, 
    handleSubmit: categoryFormHandleSubmit, 
    reset: resetCategoryForm
  } = useForm<ICategoryPayload>()

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "rgb(243 244 246)"
      },
    }
  }

  const addCategory: SubmitHandler<ICategoryPayload> = async (data: ICategoryPayload) => {
    setSubmitted(true)

    try {
      const {data: {message}}: AxiosResponse<IApiResponse<never>> = await api.post(EEndpoints.ADD_CATEGORY, {...data})
    
      setSubmitted(false)
      setIsOpen(false)

      resetCategoryForm()
      showToast("success", message)
    } catch (err) {
      const error: Error = err as Error

      console.error(err)
      showToast("error", error.message ?? "Category not added, please check the logs for more details.")
      setSubmitted(false)
    }
  }

  return (
    <>
      <div className="w-full p-10 flex flex-col">
        <div className="w-full flex justify-end mb-4">
          <button
            className="bg-blue-500 shadow-sm hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            onClick={() => setIsOpen(true)}
          >
            Add Category
          </button>
        </div>
        <DataTable 
          columns={columns}
          data={data}
          progressPending={processing}
          customStyles={customStyles}
          fixedHeader
          pagination
        />
      </div>
      <Modal
        isOpen={isOpen}
        onAfterOpen={() => {}}
        onRequestClose={() => {}}
        contentLabel="Add Category"
        style={modalStyle}
      >
        <div className="w-full flex justify-center pb-3 mb-3 border-b">
          <span className="font-bold uppercase">add category</span>
        </div>
        <form onSubmit={categoryFormHandleSubmit(addCategory)}>
          <Input 
            hasLabel={true}
            label="Title"
            type="text"
            name="title"
            placeholder="Title"
            register={categoryFormRegister}
            rules={{required: true}}
          />
          <Input
            hasLabel={true}
            label="Description"
            type="text"
            name="description"
            placeholder="Description"
            register={categoryFormRegister}
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
      </Modal>
    </>
  )
}

export default AdminCategoryPage
