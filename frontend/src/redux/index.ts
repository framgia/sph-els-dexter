import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./user/user-slices"
import toastReducer from "./toast/toast-slices"

const store = configureStore({
  reducer: {
    user: userReducer,
    toast: toastReducer
  }
})

export default store
export type RootState = ReturnType<typeof store.getState>