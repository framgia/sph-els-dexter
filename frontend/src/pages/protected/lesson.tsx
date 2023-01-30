import DataTable, {TableColumn} from "react-data-table-component"

interface ITableData {
  _id?: string;
  title: string;
  description: string;
  categories?: string[];
}

const LessonPage = () => {
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "rgb(243 244 246)"
      },
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
            <span className="cursor-pointer underline" id={row._id} onClick={() => null}>Add Category</span>
            &nbsp;|&nbsp;
            <span className="cursor-pointer underline" id={row._id} onClick={() => null}>Edit</span>
            &nbsp;|&nbsp;
            <span className="cursor-pointer underline" id={row._id} onClick={() => null}>Delete</span>
          </div>
        )
      },
      name: "Action"
    }
  ]

  const testData: ITableData[] = [
    {
      title: "Lesson 1",
      description: "Lesson 1 description"
    }
  ]

  return (
    <>
      <div className="w-full p-10 flex flex-col">
        <div className="w-full flex justify-between mb-4">
          <input 
            className="w-1/2 p-2 border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-2 mt-2" 
            type="text" 
            placeholder="Search for a lesson.."
            onInput={(e) => null} 
          />
          <button
            className="bg-blue-500 shadow-sm hover:bg-blue-700 text-white font-bold text-sm py-2 px-4 border border-blue-700 rounded"
            onClick={() => {}}
          >
            Add Lesson
          </button>
        </div>
        <DataTable 
          columns={columns}
          data={testData}
          progressPending={false}
          customStyles={customStyles}
          fixedHeader
          pagination
        />
      </div>
    </>
  )
}

export default LessonPage
