import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {ISession} from "./user-states"
import {ELoginActions} from "./user-actions"
import {ITokens} from "../../types"

const sessionInitialState: ISession = {
  loggedIn: false,
  accessToken: undefined,
  refreshToken: undefined
}

export const userSessionSlice = createSlice({
  name: ELoginActions.Login,
  initialState: sessionInitialState,
  reducers: {
    login: (state, action: PayloadAction<ITokens>) => {
      state = {
        ...state,
        loggedIn: true,
        ...action.payload
      }

      return state
    },
    logout: state => {
      state = {
        ...state,
        loggedIn: false,
        accessToken: undefined,
        refreshToken: undefined
      }

      return state
    }
  }
})

export const {login, logout} = userSessionSlice.actions
export default userSessionSlice.reducer
