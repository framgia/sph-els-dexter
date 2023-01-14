import axios from "axios"
import {DEV_BASE_URL, PROD_BASE_URL, NODE_ENV} from "./../configs"
import {EEnvironment} from "./../enums"

const baseURL: string = NODE_ENV && NODE_ENV === EEnvironment.DEVELOPMENT
  ? DEV_BASE_URL ?? ""
  : PROD_BASE_URL ?? ""

export const instance = axios.create({baseURL})
