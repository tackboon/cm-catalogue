import { AnyAction } from "redux";
import { addToast, removeToast } from "./toast.action";
import { ToastData } from "./toast.types";

export type ToastState = {
  readonly toasts: ToastData[];
};

const INITIAL_STATE: ToastState = {
  toasts: [],
};

export const toastReducer = (
  state = INITIAL_STATE,
  action: AnyAction
): ToastState => {
  if (addToast.match(action)) {
    return {
      ...state,
      toasts: [...state.toasts, action.payload],
    };
  }

  if (removeToast.match(action)) {
    return {
      ...state,
      toasts: state.toasts.filter((t) => t.id !== action.payload),
    };
  }

  return state;
};
