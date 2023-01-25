interface ITableData {
  id?: string;
  title: string;
  description: string;
}

interface IModalComponentProp {
  setIsOpen: (state: boolean) => void;
  data?: ITableData;
}

const AddWordModalContent = ({setIsOpen, data}: IModalComponentProp) => {
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
