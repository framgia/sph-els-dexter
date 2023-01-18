import React, {useState} from "react"
import {useForm, SubmitHandler} from "react-hook-form"
import {useNavigate} from "react-router-dom"
import {ERouteNames} from "../../enums"
import {Input, Header, LoadingIndicator} from "../../components"

interface ISignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const navigate = useNavigate()
  const {register, handleSubmit} = useForm<ISignUpForm>()

  const [submitted, setSubmitted] = useState<boolean>(false)

  const submit: SubmitHandler<ISignUpForm> = (data) => {
    setSubmitted(true)
  }

  return (
    <div className="h-screen flex">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border shadow-md py-10 px-16">
        <Header headerText="Sign Up" subHeader="Already have an account?" routePath={ERouteNames.ROOT_PAGE} hyperlinkText="Click here to login." />
        <form onSubmit={handleSubmit(submit)}>
          <Input 
            hasLabel={true}
            label="Name"
            type="text"
            name="name"
            placeholder="Your Name"
            register={register}
            rules={{required: true}}
          />
          <Input
            hasLabel={true}
            label="Email"
            type="email"
            name="email"
            placeholder="Your Email"
            register={register}
            rules={{required: true}}
          />
          <Input
            hasLabel={true}
            label="Password"
            type="password"
            name="password"
            placeholder="Your Password"
            register={register}
            rules={{required: true}}
          />
          <Input
            hasLabel={true}
            label="Confirm Password"
            type="password"
            name="confirmpassword"
            placeholder="Confirm Password"
            register={register}
            rules={{required: true}}
          />
          <div className="flex justify-center items-center mt-3">
            <div className="flex flex-col w-full">
              <button
                className="bg-sky-800 py-2 px-4 text-sm text-white w-full rounded border hover:bg-sky-900 focus:outline-none focus:border-sky-900"
                type="submit"
              >
                {submitted ? <LoadingIndicator /> : "Sign Up"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
