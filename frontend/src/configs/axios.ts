import axios from "axios"
import {DEV_BASE_URL} from "."

export const api = axios.create({baseURL: DEV_BASE_URL})