import {useState} from "react"
import {Input, LoadingIndicator} from "./../../components"
import {SubmitHandler, useForm, useFieldArray} from "react-hook-form"

interface IChoice {
  id: number;
  choice: string;
  correctChoice: boolean;
}

interface IAddWordForm {
  word: string;
  choices: IChoice[];
}

const WordPage = () => {
  const [submitted, setSubmitted] = useState<boolean>(false)

  const {register, handleSubmit, control} = useForm<IAddWordForm>({
    defaultValues: {
      choices: [
        {
          id: 1,
          choice: "",
          correctChoice: false
        }
      ]
    }
  })

  const {fields, append, remove} = useFieldArray({
    name: "choices",
    control
  })

  const submit: SubmitHandler<IAddWordForm> = (data: IAddWordForm) => {
    console.log(data)
  }

  return (
    <div className="w-full flex flex-col justify-center items-center pt-10">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border shadow-md py-10 px-16">
        <form onSubmit={handleSubmit(submit)}>
          <div className="border-b">
            <Input 
              hasLabel={true}
              label="Word"
              type="text"
              name="word"
              placeholder="Word"
              register={register}
              rules={{required: true}}
            />
          </div>
          <div className="py-2 border-b">
            <div className="w-full flex justify-end mb-4">
              <span className="flex justify-center items-center text-xs underline cursor-pointer" onClick={() => append({id: fields.length+1, choice: "", correctChoice: false})}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add option field
              </span>
            </div>
            {
              fields.map((item: IChoice, index: number) => {
                return (
                  <div className="flex flex-col py-3" key={item.id}>
                    <div className="w-full flex justify-center">
                      <div className="grow">
                        <Input
                          hasLabel={false}
                          type="text"
                          name={`choices.${index}.choice`}
                          placeholder={`Option ${index+1}`}
                          register={register}
                          rules={{required: true}}
                        />
                      </div>
                      <span className="mt-3 cursor-pointer" onClick={() => {remove(index)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>
                    </div>
                    <div className="-mt-4 flex items-center">
                      <input type="checkbox" {...register(`choices.${index}.correctChoice`)} />
                      <span className="text-xs">Mark as the correct answer.</span>
                    </div>
                  </div>
                )
              })
            }

          </div>
          <div className="flex justify-center items-center mt-3">
            <div className="flex flex-col w-full">
              <button
                className="bg-sky-800 py-2 px-4 text-sm text-white w-full rounded border hover:bg-sky-900 focus:outline-none focus:border-sky-900"
                type="submit"
              >
                {submitted ? <LoadingIndicator /> : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WordPage
