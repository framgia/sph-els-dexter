import React, {ReactNode, useEffect} from "react"
import {Location, useLocation, Link, useNavigate} from "react-router-dom"
import {useSelector} from "react-redux"
import {RootState} from "./../../redux"
import {ERouteNames} from "./../../enums"

interface ILayoutProps {
  children: ReactNode
}

const ProtectedLayout: React.FC<ILayoutProps> = ({children}: ILayoutProps) => {
  const location: Location = useLocation()
  const navigate = useNavigate()

  const avatar: string = useSelector((state: RootState): string => state.userdata.avatar)
  const isLoggedIn: boolean = useSelector((state: RootState) => state.session.loggedIn)

  const pathName: string = location.pathname
  const currentRoute: string | null = pathName === ERouteNames.DASHBOARD_PAGE
    ? "Dashboard"
    : pathName === ERouteNames.PROFILE_PAGE
    ? "Profile"
    : pathName === ERouteNames.QUIZ_PAGE
    ? "Quiz"
    : null

  /**
   * 
   * binuang wala nigana, diko motoo aning styla ni
   */
  useEffect(() => {
    if (!isLoggedIn) return navigate(ERouteNames.ROOT_PAGE)
  }, [isLoggedIn])

  return (
    <div className="w-full flex flex-col">
      <div className="w-full py-4 px-6 bg-gray-100 flex justify-between items-center  ">
        <label htmlFor="currentpage" className="font-semibold">{currentRoute}</label>
        <div className="flex items-center">
          <ul className="text-base text-gray-700 pt-4 md:flex md:justify-between md:pt-0">
            <li>
              <Link to={ERouteNames.DASHBOARD_PAGE} className="py-2 block md:p-4 hover:text-purple-400">Dashboard</Link>
            </li>
            <li>
              <Link to={ERouteNames.QUIZ_PAGE} className="py-2 block md:p-4 hover:text-purple-400">Quiz</Link>
            </li>
            <li>
              <Link to={ERouteNames.QUIZ_PAGE} className="py-2 block md:p-4 hover:text-purple-400">Settings</Link>
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
