import {createSlice} from "@reduxjs/toolkit"
import {ISession} from "./../user-states"
import {EUserActions} from "./../user-actions"

const sessionInitialState: ISession = {
  loggedIn: false,
  accessToken: undefined,
  refreshToken: undefined
}

export const userSessionSlice = createSlice({
  name: EUserActions.SESSION,
  initialState: sessionInitialState,
  reducers: {
    login: (state) => {
      state = {
        ...state,
        loggedIn: true
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
