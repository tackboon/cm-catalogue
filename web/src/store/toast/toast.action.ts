import {
  ActionWithPayload,
  createAction,
  withMatcher,
} from "../../utils/reducer/reducer.util";
import { ToastData, TOAST_ACTION_TYPES } from "./toast.types";

export type AddToast = ActionWithPayload<
  TOAST_ACTION_TYPES.ADD_TOAST,
  ToastData
>;

export type RemoveToast = ActionWithPayload<
  TOAST_ACTION_TYPES.REMOVE_TOAST,
  number
>;

export const addToast = withMatcher(
  (toast: ToastData): AddToast =>
    createAction(TOAST_ACTION_TYPES.ADD_TOAST, toast)
);

export const removeToast = withMatcher(
  (toastID: number): RemoveToast =>
    createAction(TOAST_ACTION_TYPES.REMOVE_TOAST, toastID)
);
