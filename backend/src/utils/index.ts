import {ErrorException, respondError} from "./error"
<<<<<<< Updated upstream
import {comparePassword, generateToken, hashPassword} from "./methods"

export {ErrorException, respondError, comparePassword, generateToken, hashPassword}
=======
import {hashPassword, generateToken, comparePassword} from "./methods"

export {ErrorException, respondError, hashPassword, generateToken, comparePassword}
>>>>>>> Stashed changes
