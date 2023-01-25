interface ILog {
  avatar: string;
  action: string;
  time: string;
}

interface IActivityLogsProps {
  logs?: ILog[]
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
        <ul className="w-full max-w-md space-y-1 list-none list-inside">
          {
            logs && logs.length ? logs.map(({avatar, action, time}: ILog, index: number) => {
              return (
                <li className="flex items-center py-2" key={index}>
                  <div className="px-4 pr-6">
                    <img className="w-14 h-14 rounded-full" src={avatar} alt="avatar" />
                  </div>
                  <div className="tracking-tight leading-normal flex flex-col">
                    <span className="p-0 font-medium">{action}</span>
                    <span className="text-gray-500 p-0 -mt-2 text-sm">{time}</span>
                  </div>
                </li>
              )
            }) : (
              <li className="w-full">
                <div className="flex items-center justify-center py-4">
                  <span className="font-semibold">No activity as of the moment.</span>
                </div>
              </li>
            )
          }
        </ul>
      </div>
    </div>
  )
}

export default ActivityLogs
