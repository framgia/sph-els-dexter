import {login, logout} from "./user/user-slices"
import {toggle} from "./toast/toast-slices"

export const slices = {
  user: {login, logout},
  toast: {toggle}
}