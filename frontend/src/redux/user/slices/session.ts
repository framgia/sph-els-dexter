import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {ISession} from "./../user-states"
import {EUserActions} from "./../user-actions"
import {ITokens} from "../../../types"

const sessionInitialState: ISession = {
  loggedIn: false,
  accessToken: undefined,
  refreshToken: undefined
}

export const userSessionSlice = createSlice({
  name: EUserActions.SESSION,
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

const {actions, reducer} = userSessionSlice
export const {login, logout} = actions
export default reducer
