import { AxiosResponse } from "axios"
import { useState, useCallback, useEffect } from "react"
import {useSelector} from "react-redux"
import {Link} from "react-router-dom"
import {useToast} from "./../../hooks"
import {ActivityLogs} from "../../components"
import { api } from "../../configs"
import {EEndpoints, ERouteNames} from "../../enums"
import {RootState} from "../../redux"
import {IUserDetails} from "../../redux/user/user-states"
import { IApiResponse } from "../../types"

interface ISocialData {
  followers?: number;
  following?: number;
  wordsLearned?: number;
}

interface ISocialData {
  followers?: number;
  following?: number;
  wordsLearned?: number;
}

const ProfilePage = () => {
  const {showToast} = useToast()
  const [logs, setLogs] = useState<ILogs[]>()
  const [social, setSocial] = useState<ISocialData>()

  const {avatar, name, role, email}: IUserDetails = useSelector((state: RootState): IUserDetails => state.userdata)

  const dataFetch = useCallback(async () => {
    const [
      {data: {data: {auditTrail}}},
      {data: {data: {followers, following, wordsLearned}}}
    ] = await Promise.all<
      AxiosResponse<IApiResponse<IPersonalLogs>> & 
      AxiosResponse<IApiResponse<ISocialData>>
    >([
      api.post(EEndpoints.AUDIT_LOGS, {email}),
      api.post(EEndpoints.SOCIAL, {email})
    ])

    setLogs(auditTrail)
    setSocial({followers, following, wordsLearned})
  }, [])

  useEffect(() => {
    dataFetch()
      .catch((err: Error) => {
        showToast("error", err.message ?? "Unable to fetch personal audit log details, please try again later.")
      })
  }, [dataFetch])

  return (
    <div className="flex px-6">
      {/* Left section for the personal profile */}
      <div className="w-2/4 flex justify-center items-center mt-36">
        <div className="w-2/4">
          <div className="py-3">
            <div className="photo-wrapper p-2">
              <img className="w-32 h-32 mx-auto" src={avatar} alt="John Doe"/>
            </div>
            <div className="p-2 border-b-2 pb-6">
              <h3 className="text-center text-xl text-gray-900 font-bold leading-8">{name}</h3>
              <div className="text-center text-gray-400 text-xs font-semibold">
                <p className="capitalize">{role}</p>
              </div>
            </div>
            <div className="w-full flex justify-between mt-4">
              <div className="flex flex-col grow items-center justify-center font-medium"><div>{social?.followers}</div><span>followers</span></div>
              <div className="flex flex-col grow items-center justify-center font-medium"><div>{social?.following}</div><span>following</span></div>
            </div>
            <div className="w-full flex items-center justify-center mt-4">
              <Link to={ERouteNames.DASHBOARD_PAGE} className="text-sm text-blue-700 hiver:text-blue-800 underline font-semibold">Learned {social?.wordsLearned} words</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right section for personal activity logs */}
      <div className="w-full p-8">
        <ActivityLogs logs={testLogs} />
      </div>
    </div>
  )
}

export default ProfilePage
