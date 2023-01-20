import {configureStore} from "@reduxjs/toolkit"
import userSessionReducer from "./user/slices/session"
import userDataLogReducer from "./user/slices/data-log"

const store = configureStore({
  reducer: {
    session: userSessionReducer,
    userdata: userDataLogReducer
  }
})

export default store
export type RootState = ReturnType<typeof store.getState>
