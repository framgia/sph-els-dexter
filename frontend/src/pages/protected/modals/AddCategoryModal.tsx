import {AxiosResponse} from "axios";
import {useState} from "react";
import {useForm, SubmitHandler} from "react-hook-form";
import { useToast } from "./../../../hooks";
import {Input, LoadingIndicator} from "../../../components";
import {api} from "../../../configs";
import {EEndpoints} from "../../../enums";
import {IApiResponse} from "../../../types";

interface ITableData {
  id?: string;
  title: string;
  description: string;
}

interface ICategoryPayload {
  title: string;
  description: string;
}

interface IModalComponentProp {
  setIsOpen: (state: boolean) => void;
  data?: ITableData;
}

const AddCategoryModalContent = ({setIsOpen}: IModalComponentProp) => {
  const [submitted, setSubmitted] = useState<boolean>(false)
  const {showToast} = useToast()

  const {
    register: categoryFormRegister, 
    handleSubmit: categoryFormHandleSubmit, 
    reset: resetCategoryForm
  } = useForm<ICategoryPayload>()

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
    </>
  )
}

export default AddCategoryModalContent
