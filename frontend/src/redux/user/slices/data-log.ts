import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {IUserDetails} from "./../user-states"
import {EUserActions} from "./../user-actions"
import {DEFAULT_AVATAR} from "./../../../configs"

const dataInitialState: IUserDetails = {
  avatar: DEFAULT_AVATAR ?? "",
  email: "",
  name: "",
  role: "student"
}

export const userSessionSlice = createSlice({
  name: EUserActions.LOGDATA,
  initialState: dataInitialState,
  reducers: {
    logData: (state, action: PayloadAction<IUserDetails>) => {
      return {
        ...state,
        ...action.payload
      }
    },
    reset: (state) => {
      state = dataInitialState

      return state
    }
  }
})

const {actions, reducer} = userSessionSlice
export const {logData, reset} = actions
export default reducer
