import React, {ReactNode} from "react"
import {Location, useLocation} from "react-router-dom"
import {ERouteNames} from "./../../enums"
import {DEFAULT_AVATAR} from "./../../configs"

interface ILayoutProps {
  children: ReactNode
}

const ProtectedLayout: React.FC<ILayoutProps> = ({children}: ILayoutProps) => {
  const location: Location = useLocation()

  const pathName: string = location.pathname
  const currentRoute: string | null = pathName === ERouteNames.DASHBOARD_PAGE
    ? "Dashboard"
    : pathName === ERouteNames.PROFILE_PAGE
    ? "Profile"
    : pathName === ERouteNames.QUIZ_PAGE
    ? "Quiz"
    : null

  return (
    <div className="w-full flex flex-col">
      <div className="w-full py-4 px-6 bg-gray-100 flex justify-between">
        <label htmlFor="currentpage" className="font-semibold">{currentRoute}</label>
        <div>
          <img className="w-10 h-10 rounded-full" src={DEFAULT_AVATAR} alt="avatart" />
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  )
}

export default ProtectedLayout
