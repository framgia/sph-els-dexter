import {useSelector} from "react-redux"
import {Link} from "react-router-dom"
import {ActivityLogs} from "../../components"
import {ERouteNames} from "../../enums"
import {RootState} from "../../redux"
import {IUserDetails} from "../../redux/user/user-states"

const ProfilePage = () => {
  const {avatar, name, role}: IUserDetails = useSelector((state: RootState): IUserDetails => state.userdata)

  const testLogs = [
    {
      avatar,
      activityParagraph: "Finishing up a ask from asana.",
      time: "2 hours"
    },
    {
      avatar,
      activityParagraph: "Finishing up a ask from asana.",
      time: "2 hours"
    },
    {
      avatar,
      activityParagraph: "Finishing up a ask from asana.",
      time: "2 hours"
    }
  ]

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
              <div className="flex flex-col grow items-center justify-center font-medium"><div>50</div><span>followers</span></div>
              <div className="flex flex-col grow items-center justify-center font-medium"><div>50</div><span>following</span></div>
            </div>
            <div className="w-full flex items-center justify-center mt-4">
              <Link to={ERouteNames.DASHBOARD_PAGE} className="text-sm text-blue-700 hiver:text-blue-800 underline font-semibold">Learned 20 words</Link>
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
