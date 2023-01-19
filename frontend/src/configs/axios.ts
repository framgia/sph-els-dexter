import axios from "axios"
import {DEV_BASE_URL} from "."

axios.defaults.withCredentials = true
export const api = axios.create({baseURL: DEV_BASE_URL})
