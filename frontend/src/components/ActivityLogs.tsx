interface ILog {
  avatar: string;
  activityParagraph: string;
  time: string;
}

interface IActivityLogsProps {
  logs: ILog[]
}

const ActivityLogs = ({logs}: IActivityLogsProps) => {
  return (
    <div className="w-full flex flex-col p-4 border">
      {/* Header */}
      <div className="py-4 border-b-2 w-full">
        <span className="font-bold text-lg">Activities</span>
      </div>

      {/* Logs section */}
      <div className="py-4 w-full">
        <ul className="max-w-md space-y-1 list-none list-inside">
          {
            logs.length ? logs.map(({avatar, activityParagraph, time}: ILog, index: number) => {
              return (
                <li className="flex items-center py-2" key={index}>
                  <div className="px-4 pr-6">
                    <img className="w-14 h-14 rounded-full" src={avatar} alt="avatar" />
                  </div>
                  <div className="tracking-tight leading-normal flex flex-col">
                    <span className="p-0 font-medium">{activityParagraph}</span>
                    <span className="text-gray-500 p-0 -mt-2 text-sm">{time}</span>
                  </div>
                </li>
              )
            }) : (
              <div className="flex items-center justify-center py-4">
                <span className="font-semibold">No activity as of the moment.</span>
              </div>
            )
          }
        </ul>
      </div>
    </div>
  )
}

export default ActivityLogs
