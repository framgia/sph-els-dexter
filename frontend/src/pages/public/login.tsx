import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import {useDispatch} from "react-redux";
import {ERouteNames} from "../../enums"
import {Input, Header, LoadingIndicator} from "../../components"

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [submitted, setSubmitted] = useState<boolean>(false)

  const handleSubmit = () => {
    setSubmitted(true)
    navigate(ERouteNames.DASHBOARD_PAGE)
  }

  return (
    <div className="h-screen flex">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border shadow-md py-10 px-16">
        <Header headerText="Login" subHeader="Don't have an account yet?" routePath={ERouteNames.SIGNUP_PAGE} hyperlinkText="Click here to signup." />
        <form onSubmit={handleSubmit}>
          <Input 
            hasLabel={true}
            label="Email"
            type="email"
            id="email"
            placeholder="Your Email"
            value={email}
            onInput={e => setEmail(e.currentTarget.value)}
            required={true}
          />
          <Input 
            hasLabel={true}
            label="Password"
            type="password"
            id="password"
            placeholder="Your Password"
            value={password}
            onInput={e => setPassword(e.currentTarget.value)}
            required={true}
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
