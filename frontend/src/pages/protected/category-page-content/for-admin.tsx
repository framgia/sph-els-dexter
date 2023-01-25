import {useState, useEffect, useCallback} from "react"
import DataTable, {TableColumn} from "react-data-table-component"
import Modal from "react-modal"
import {AxiosResponse} from "axios"
import {AddCategoryModalContent, AddWordToCategoryModal, EditCategoryModalContent} from "./../modals"
import {useToast} from "./../../../hooks"
import {api} from "./../../../configs"
import {IApiResponse} from "./../../../types"
import {EEndpoints} from "./../../../enums"

interface ITableData {
  _id?: string;
  title: string;
  description: string;
  words?: string[];
}

interface IModalContent {
  addCategoryComponent: {render: boolean};
  addWordComponent: {render: boolean; props: ITableData};
  editCategoryComponent: {render: boolean; props: ITableData};
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

const AdminCategoryPage = () => {
  const {showToast} = useToast()

  const [processing, setProcessing] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchWord, setSearchWord] = useState<string>("")

  const [data, setData] = useState<ITableData[]>([])
  const [filteredData, setFilteredData] = useState<ITableData[]>([])

  const updatedWords = (categoryId?: string, words?: string[]) => {
    if (categoryId && words) {
      setData([
        ...data.map((item: ITableData) => {
          if (item._id === categoryId) {
            item.words = words
          }

          return item
        })
      ])
      setFilteredData([
        ...data.map((item: ITableData) => {
          if (item._id === categoryId) {
            item.words = words
          }

          return item
        })
      ])
    }
  }

  const newWordAdded = (categoryId?: string, wordId?: string) => {
    if (categoryId && wordId) {
      setData([
        ...data.map((item: ITableData) => {
          if (item._id === categoryId) {
            if (item.words) {
              item.words = [...item.words, wordId]
            } else {
              item.words = [wordId]
            }
          }

          const removeDuplicate = item.words ? [...new Set(item.words)] : []
          item.words = removeDuplicate

          return item
        })
      ])
      setFilteredData([
        ...data.map((item: ITableData) => {
          if (item._id === categoryId) {
            if (item.words) {
              item.words = [...item.words, wordId]
            } else {
              item.words = [wordId]
            }
          }

          const removeDuplicate = item.words ? [...new Set(item.words)] : []
          item.words = removeDuplicate

          return item
        })
      ])
    }
  }

  const dataFetch = useCallback(async () => {
    setProcessing(true)

    try {
      const {data: {data: responseData}}: AxiosResponse<IApiResponse<ITableData[]>> = await api.get(EEndpoints.CATEGORY_LIST)

      setData(responseData)
      setFilteredData(responseData)
      setProcessing(false)
    } catch (err) {
      setProcessing(false)
      throw err
    }
  }, [])

  useEffect(() => {
    dataFetch()
      .catch((err: Error) => {
        console.error(err)
        showToast("error", "Unable to fetch list, please check the console for more details.")
      })
  }, [dataFetch])

  const modalContentDefault: IModalContent = {
    addCategoryComponent: {render: false},
    addWordComponent: {
      render: false,
      props: {
        description: "",
        title: "",
        _id: ""
      }
    },
    editCategoryComponent: {
      render: false,
      props: {
        description: "",
        title: "",
        _id: ""
      }
    }
  }
  
  const [modalContent, setModalContent] = useState<IModalContent>(modalContentDefault)

  const setContent = (
    component: "addCategoryComponent" | "addWordComponent" | "editCategoryComponent",
    data?: ITableData
  ) => {
    const defaultProp: ITableData = {
      description: "",
      title: "",
      _id: ""
    }

    const content: IModalContent = {
      addCategoryComponent: {render: component === "addCategoryComponent"},
      addWordComponent: {
        render: component === "addWordComponent",
        props: component === "addWordComponent" && data ? data : defaultProp
      },
      editCategoryComponent: {
        render: component === "editCategoryComponent",
        props: component === "editCategoryComponent" && data ? data : defaultProp
      }
    }

    setModalContent(content)
  }

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "rgb(243 244 246)"
      },
    }
  }

  const addWordToCategory = (data: ITableData) => {
    setContent("addWordComponent", data)
    setIsOpen(true)
  }

  const editCategory = (data: ITableData) => {
    setContent("editCategoryComponent", data)
    setIsOpen(true)
  }

  const addCategory = () => {
    setContent("addCategoryComponent")
    setIsOpen(true)
  }

  const deleteCategory = async (data: ITableData) => {
    const ask = window.confirm("Are you sure you want to delete this category?")

    if (ask) {
      try {
        const {data: {message}}: AxiosResponse<IApiResponse<never>> = await api.delete(`${EEndpoints.DELETE_CATEGORY}/${data._id}`)
      
        showToast("success", message)
        dataFetch()
          .catch(err => {throw err})
      } catch (err) {
        const error: Error = err as Error

        console.error(err)
        showToast("error", error.message)
      }
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
            <span className="cursor-pointer underline" id={row._id} onClick={() => addWordToCategory(row)}>Add word</span>
            &nbsp;|&nbsp;
            <span className="cursor-pointer underline" id={row._id} onClick={() => editCategory(row)}>Edit</span>
            &nbsp;|&nbsp;
            <span className="cursor-pointer underline" id={row._id} onClick={() => deleteCategory(row)}>Delete</span>
          </div>
        )
      },
      name: "Action"
    }
  ]

  useEffect(() => {
    if (searchWord)  {
      setFilteredData([...data].filter((item: ITableData) => item.title.toLowerCase().includes(searchWord.toLowerCase())))
    } else {
      setFilteredData(data)
    }
  }, [searchWord])

  return (
    <>
      <div className="w-full p-10 flex flex-col">
        <div className="w-full flex justify-between mb-4">
          <input 
            className="w-1/2 p-2 border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-2 mt-2" 
            type="text" 
            placeholder="Search for a category.."
            onInput={(e) => setSearchWord(e.currentTarget.value)} 
          />
          <button
            className="bg-blue-500 shadow-sm hover:bg-blue-700 text-white font-bold text-sm py-2 px-4 border border-blue-700 rounded"
            onClick={addCategory}
          >
            Add Category
          </button>
        </div>
        <DataTable 
          columns={columns}
          data={filteredData}
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
        {
          modalContent.addCategoryComponent.render
          ? <AddCategoryModalContent setIsOpen={setIsOpen} />
          : modalContent.addWordComponent.render
          ? <AddWordToCategoryModal setIsOpen={setIsOpen} data={modalContent.addWordComponent.props} newWordAdded={newWordAdded} />
          : modalContent.editCategoryComponent.render
          ? <EditCategoryModalContent setIsOpen={setIsOpen} data={modalContent.editCategoryComponent.props} updatedWords={updatedWords} />
          : null
        }
      </Modal>
    </>
  )
}

export default AdminCategoryPage
