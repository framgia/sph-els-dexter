import React, {useState} from "react"
import {useNavigate, Link} from "react-router-dom"
import {slices} from "../../redux/slice-collection"
import {useDispatch} from "react-redux";
import {ERouteNames} from "../../enums"
import {Input} from "../../components"

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()

  const handleSubmit = () => {
    dispatch(slices.user.login({accessToken: "thisisatesttoken"}))
    navigate(ERouteNames.DASHBOARD_PAGE)
  }

  return (
    <div className="h-screen flex">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border shadow-md py-10 px-16">
        <h1 className="text-2xl font-medium mt-4 mb-12 text-center">
          Log in to your account 🔐
        </h1>

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
              <p className="text-xs pb-1">No account yet? Click <Link to={ERouteNames.SIGNUP_PAGE} className="hover:underline text-blue-600">here</Link> to register.</p>
              <button
                className="bg-sky-800 py-2 px-4 text-sm text-white w-full rounded border hover:bg-sky-900 focus:outline-none focus:border-sky-900"
                type="submit"
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login