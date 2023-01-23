import {EHttpStatusCode} from "./status-codes"
import {EEnvironment} from "./environment"

const now = new Date()

const EToken = {
  EXPIRY: new Date(now.setHours(now.getHours() + 8))
}

export {EHttpStatusCode, EToken, EEnvironment}
