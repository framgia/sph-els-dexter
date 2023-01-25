import {useState} from "react"
import DataTable, {TableColumn} from "react-data-table-component"
import Modal from "react-modal"
import {AddCategoryModalContent, AddWordToCategoryModal, EditCategoryModalContent} from "./../modals"

interface ITableData {
  id?: string;
  title: string;
  description: string;
}

interface IModalComponentProp {
  setIsOpen: (state: boolean) => void;
  data?: ITableData;
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
  const [processing, setProcessing] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const modalContentDefault: IModalContent = {
    addCategoryComponent: {render: false},
    addWordComponent: {
      render: false,
      props: {
        description: "",
        title: "",
        id: ""
      }
    },
    editCategoryComponent: {
      render: false,
      props: {
        description: "",
        title: "",
        id: ""
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
      id: ""
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
            <span className="cursor-pointer underline" id={row.id} onClick={() => addWordToCategory(row)}>Add word</span>
            &nbsp;|&nbsp;
            <span className="cursor-pointer underline" id={row.id} onClick={() => editCategory(row)}>Edit</span>
            &nbsp;|&nbsp;
            <span className="cursor-pointer underline" id={row.id}>Delete</span>
          </div>
        )
      },
      name: "Action"
    }
  ]

  return (
    <>
      <div className="w-full p-10 flex flex-col">
        <div className="w-full flex justify-end mb-4">
          <button
            className="bg-blue-500 shadow-sm hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            onClick={addCategory}
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
        {
          modalContent.addCategoryComponent.render
          ? <AddCategoryModalContent setIsOpen={setIsOpen} />
          : modalContent.addWordComponent.render
          ? <AddWordToCategoryModal setIsOpen={setIsOpen} data={modalContent.addWordComponent.props} />
          : modalContent.editCategoryComponent.render
          ? <EditCategoryModalContent setIsOpen={setIsOpen} data={modalContent.editCategoryComponent.props} />
          : null
        }
      </Modal>
    </>
  )
}

export default AdminCategoryPage
