import React, {ReactNode} from "react"
import {Location, useLocation, Link} from "react-router-dom"
import {useSelector} from "react-redux"
import {Cookies} from "react-cookie"
import Modal from "react-modal"
import {AxiosResponse} from "axios"
import {RootState} from "./../../redux"
import {slices} from "./../../redux/slice-collection"
import {ERouteNames, EEndpoints} from "./../../enums"
import {IApiResponse} from "./../../types"
import {api} from "./../../configs"
import {useToast} from "./../../hooks"
import {IUserDetails} from "../../redux/user/user-states"
import {verifyToken} from "../../utils"

Modal.setAppElement("#root")

interface ILayoutProps {
  children: ReactNode
}

const ProtectedLayout: React.FC<ILayoutProps> = ({children}: ILayoutProps) => {
  const {showToast} = useToast()
  const location: Location = useLocation()
  const cookie = new Cookies()

  const avatar: string = useSelector((state: RootState): string => state.userdata.avatar)
  const role: "student" | "admin" = useSelector((state: RootState) => state.userdata.role)

  const pathName: string = location.pathname
  const currentRoute: string | null = pathName === ERouteNames.DASHBOARD_PAGE
    ? "Dashboard"
    : pathName === ERouteNames.PROFILE_PAGE
    ? "Profile"
    : pathName.includes(ERouteNames.QUIZ_PAGE)
    ? "Quiz"
    : pathName === ERouteNames.WORD_PAGE
    ? "Word"
    : pathName === ERouteNames.CATEGORY_PAGE
    ? "Category"
    : null

    const reset = () => {
      cookie.remove("refresh_token")

      slices.datalog.reset()
      slices.session.logout()

      window.location.href = "/"
    }

    const signOut = async () => {
      try {
        const refreshToken = cookie.get("refresh_token")

        if (!refreshToken) return reset()

        const userDetails: IUserDetails = verifyToken(refreshToken) as IUserDetails

        if (!userDetails) return reset()

        const {data: {message}}: AxiosResponse<IApiResponse<never>> = await api.post(EEndpoints.LOGOUT, {email: userDetails.email})
      
        showToast("success", message)
        reset()
      } catch (err) {
        const error: Error = err as Error

        console.error(err)
        showToast("error", error.message ?? "Unable to logout, please check the logs for more details.")
      }
    }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full py-4 px-6 bg-gray-100 flex justify-between items-center  ">
        <label htmlFor="currentpage" className="font-semibold">E-Learning System | {currentRoute}</label>
        <div className="flex items-center">
          <ul className="text-base text-gray-700 pt-4 md:flex md:justify-between md:pt-0">
            <li>
              <Link to={ERouteNames.DASHBOARD_PAGE} className="py-2 block md:p-4 hover:text-purple-400">Dashboard</Link>
            </li>
            {
              role === "admin" ? (
                <li>
                  <Link to={ERouteNames.WORD_PAGE} className="py-2 block md:p-4 hover:text-purple-400">Word</Link>
                </li>
              ) : null
            }
            <li>
              <Link to={ERouteNames.CATEGORY_PAGE} className="py-2 block md:p-4 hover:text-purple-400">Category</Link>
            </li>
            <li>
              <Link to={ERouteNames.QUIZ_PAGE} className="py-2 block md:p-4 hover:text-purple-400">Settings</Link>
            </li>
            <li>
              <span className="py-2 block md:p-4 hover:text-purple-400 cursor-pointer" onClick={signOut}>Sign Out</span>
            </li>
          </ul>
          <Link to={ERouteNames.PROFILE_PAGE} className="ml-4">
            <img className="w-10 h-10 rounded-full" src={avatar} alt="avatar" />
          </Link>
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  )
}

export default ProtectedLayout
