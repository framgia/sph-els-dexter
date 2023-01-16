export interface IToast {
  show: boolean;
  text?: string;
  isSuccess?: boolean;
  isError?: boolean;
  position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
  autoClose?: number;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  hideProgressBar?: boolean;
  draggable?: boolean;
  progress?: any | undefined;
  theme?: "light" | "dark" | "colored";
}