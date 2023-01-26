import {useState, useCallback, useEffect} from "react"
import {AxiosResponse} from "axios"
import {IApiResponse, ICategory} from "./../../../types"
import {api} from "./../../../configs"
import {EEndpoints} from "./../../../enums"
import {useToast} from "../../../hooks"

const CardComponent = ({title, description}: ICategory) => {
  return (
    <div className="flex justify-center">
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
        </a>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{description}</p>
        <div className="w-full flex justify-end">
          <button
            type="button" 
            className="inline-flex items-center px-6 py-2 text-sm font-medium text-center text-white bg-green-500 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Start
          </button>
        </div>
      </div>
    </div>
  )
}

const StudentCategoryPage = () => {
  const {showToast} = useToast()
  const [list, setList] = useState<ICategory[]>([]) /** <-- We use this as the reference during the filter */
  const [filteredList, setFilteredList] = useState<ICategory[]>([]) /** <-- This is for the display */
  const [searchFilter, setSearchFilter] = useState<string>("")

  const dataFetch = useCallback(async () => {
    try {
      const {data: {data}}: AxiosResponse<IApiResponse<ICategory[]>> = await api.get(EEndpoints.CATEGORY_LIST)

      setList(data)
      setFilteredList(data)
    } catch (err) {
      throw err
    }
  }, [])

  useEffect(() => {
    dataFetch()
      .catch((err: Error) => {
        console.error(err)
        showToast("error", err.message ?? "Could not fetch the list, check the logs for more details.")
      })
  }, [dataFetch])

  useEffect(() => {
    if (searchFilter) {
      setFilteredList([
        ...list.filter((item: ICategory) => item.title.toLowerCase().includes(searchFilter.toLowerCase()))
      ])
    } else {
      setFilteredList(list)
    }
  }, [searchFilter])

  return ( 
    <div className="w-full p-12 flex flex-col">
      <div className="w-full py-3 pl-7 border-b flex justify-between items-center">
        <span className="font-bold text-3xl">Categories</span>
        <input 
          className="w-1/3 p-2 border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-2 mt-2" 
          type="text" 
          placeholder="Search for a category.."
          onInput={(e) => setSearchFilter(e.currentTarget.value)} 
        />
      </div>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {
          filteredList.length ? filteredList.map((item: ICategory, index: number) => (
            <CardComponent 
              key={index} 
              description={item.description}
              title={item.title}
              _id={item._id}
            />
          )) : (
            <div className="col-span-4 flex justify-center">
              <span>List is empty.</span>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default StudentCategoryPage
