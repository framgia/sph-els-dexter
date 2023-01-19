import {login, logout} from "./user/slices/session"
import {logData, reset} from "./user/slices/data-log"

export const slices = {
  session: {login, logout},
  datalog: {logData, reset}
}
