import {Request, Response} from "express"
import {Send} from "express-serve-static-core"

export interface ITypedRequestBody<T> extends Request {
  body: T
}

export interface ITypedResponse<T = {data?: any; message: string;}> extends Response {
  send: Send<T, this>
}
