import {toast} from "react-toastify";

export function useToast() {
  function showToast(type: "success" | "error" | "warn" | "info", message: string) {
    toast[type](message)
  }

  return { showToast };
}