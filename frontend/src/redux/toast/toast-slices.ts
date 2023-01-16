import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {IToast} from "./toast-states"
import {EToastActions} from "./toast-actions"
import {toast} from "react-toastify"

const toastInitialState: IToast = {
  show: false,
  autoClose: 5000,
  closeOnClick: true,
  draggable: false,
  hideProgressBar: false,
  isError: false,
  isSuccess: false,
  pauseOnHover: false,
  position: "bottom-center",
  progress: undefined,
  text: "",
  theme: "light"
}

interface IToastPayload {
  show: boolean;
  text?: string;
  isError?: boolean;
  isSuccess?: boolean;
}

export const toastSlice = createSlice({
  name: EToastActions.Toggle,
  initialState: toastInitialState,
  reducers: {
    toggle: (state, action: PayloadAction<IToastPayload>) => {
      state = {
        ...state,
        ...action.payload
      }

      toast.success(state.text)

      return state
    }
  }
})

export const {toggle} = toastSlice.actions
export default toastSlice.reducer
