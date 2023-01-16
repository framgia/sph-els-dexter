import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import {useDispatch} from "react-redux"
import {ERouteNames} from "../../enums"
import {Input, Header, LoadingIndicator} from "../../components"
import {ISignUp} from "./../../types"
import {signUp} from "./../../services"
import {slices} from "./../../redux/slice-collection"
import {useToast} from "./../../hooks" 

function Signup() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {showToast} = useToast()

  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")

  const [submitted, setSubmitted] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)

    if (password !== confirmPassword) {
      return console.error("Password do not match.")
    }

    try {
      const payload: ISignUp = {name, email, password, role: 0}

      interface ISignupResult {
        data: {
          data: {
            accessToken: string;
            refreshToken: string;
            expiresIn: string;
          };
          message: string;
        }
      }

      const {data}: ISignupResult = await signUp(payload)
      
      dispatch(slices.user.login({
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken
      }))

      showToast("success", data.message)

      navigate(ERouteNames.DASHBOARD_PAGE)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="h-screen flex">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border shadow-md py-10 px-16">
        <Header headerText="Sign Up" subHeader="Already have an account?" routePath={ERouteNames.ROOT_PAGE} hyperlinkText="Click here to login." />
        <form onSubmit={(e) => handleSubmit(e)}>
          <Input 
            hasLabel={true}
            label="Name"
            type="text"
            id="name"
            placeholder="Your Name"
            value={name}
            onInput={e => setName(e.currentTarget.value)}
            required={true}
          />
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
          <Input 
            hasLabel={true}
            label="Confirm Password"
            type="password"
            id="confirmpassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onInput={e => setConfirmPassword(e.currentTarget.value)}
            required={true}
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
