import {login, logout} from "./user/slices/session"
import {logData} from "./user/slices/data-log"

export const slices = {
  session: {login, logData},
  datalog: {logData}
}
