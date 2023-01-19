import React, {useEffect} from "react"
import {Cookies} from "react-cookie"

function Dashboard() {
  const cookies = new Cookies()

  useEffect(() => console.log(cookies.getAll(), []))
  return (
    <div>This is the dashboard</div>
  )
}

export default Dashboard
