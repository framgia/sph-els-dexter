import React, {useState} from "react"
import {useForm, SubmitHandler} from "react-hook-form"
import {useNavigate} from "react-router-dom"
import {useDispatch} from "react-redux"
import {EEndpoints, ERouteNames} from "../../enums"
import {Input, Header, LoadingIndicator} from "../../components"
import {useToast} from "./../../hooks"
import {api} from "./../../configs"
import {IApiResponse, ITokens} from "./../../types"
import {AxiosResponse} from "axios"
import {verifyToken} from "./../../utils"
import {Cookies} from "react-cookie"
import {IUserDetails} from "../../redux/user/user-states"
import {slices} from "./../../redux/slice-collection"

interface ILoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {showToast} = useToast()

  const cookies = new Cookies()


  const {register, handleSubmit,} = useForm<ILoginForm>()

  const [submitted, setSubmitted] = useState<boolean>(false)

  const submit: SubmitHandler<ILoginForm> = async (data: ILoginForm) => {
    setSubmitted(true)

    try {
      const {data: {message}}: AxiosResponse<IApiResponse<never>> = await api.post(EEndpoints.LOGIN, {...data})
      
      const token: string | undefined = cookies.get("refresh_token")
      if (token) {
        const userDetails: IUserDetails = verifyToken(token) as IUserDetails

        if (!userDetails) return showToast("error", "Invalid token.")

        dispatch(slices.session.login())
        dispatch(slices.datalog.logData(userDetails))

        showToast("success", message)
        setSubmitted(false)
        
        navigate(ERouteNames.DASHBOARD_PAGE)
      }

      showToast("error", "Unauthorized access.")
    } catch (err) {
      const error: Error = err as Error
      console.error(err)
      setSubmitted(false)
      showToast("error", error.message || "Something went wrong, please check the logs for more information about the error.")
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
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
