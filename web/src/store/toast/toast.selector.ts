import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { ToastState } from "./toast.reducer";

export const selectToastReducer = (state: RootState): ToastState => state.toast;

export const selectToasts = createSelector(
  selectToastReducer,
  (toast) => toast.toasts
);
