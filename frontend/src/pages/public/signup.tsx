import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import {ERouteNames} from "../../enums"
import {Input, Header, Preloader} from "../../components"

function Signup() {
  const navigate = useNavigate()

  const [name, setName] = useState<string>()
  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [confirmPassword, setConfirmPassword] = useState<string>()

  const [submitted, setSubmitted] = useState<boolean>(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)

    if (password !== confirmPassword) {
      console.error("Password do not match.")
    }
    navigate(ERouteNames.ROOT_PAGE)
  }

  return (
    <div className="h-screen flex">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border shadow-md py-10 px-16">
        <Header headerText="Sign Up" subHeader="Already have an account?" routePath={ERouteNames.ROOT_PAGE} hyperlinkText="Login here." />
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
                {submitted ? <Preloader /> : "Sign Up"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup