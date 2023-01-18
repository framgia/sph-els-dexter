import React, {useState} from "react"
import {useForm, SubmitHandler} from "react-hook-form"
import {useNavigate} from "react-router-dom"
import {ERouteNames} from "../../enums"
import {Input, Header, LoadingIndicator} from "../../components"

interface ILoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate()

  const {register, handleSubmit,} = useForm<ILoginForm>()

  const [submitted, setSubmitted] = useState<boolean>(false)

  const submit: SubmitHandler<ILoginForm> = data => {
    setSubmitted(true)
  }

  return (
    <div className="h-screen flex">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border shadow-md py-10 px-16">
        <Header headerText="Login" subHeader="Don't have an account yet?" routePath={ERouteNames.SIGNUP_PAGE} hyperlinkText="Click here to signup." />
        <form onSubmit={handleSubmit(submit)}>
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
          <div className="flex justify-center items-center mt-3">
            <div className="flex flex-col w-full">
              <button
                className="bg-sky-800 py-2 px-4 text-sm text-white w-full rounded border hover:bg-sky-900 focus:outline-none focus:border-sky-900"
                type="submit"
              >
                {submitted ? <LoadingIndicator /> : "Login"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
