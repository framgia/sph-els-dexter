import {instance} from "./axios"
import {EEndpoints} from "./../enums"
import {ISignUp} from "./../types"

export const signUp = async (data: ISignUp): Promise<any> => {
  try {
    const result = await instance.post(EEndpoints.SIGNUP, {...data})

    return result
  } catch (err) {
    throw err
  }
}
