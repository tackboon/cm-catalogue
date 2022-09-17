import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { TusUploadState } from "./tus_upload.reducer";

export const selectTusUploadReducer = (state: RootState): TusUploadState =>
  state.tusUpload;

export const selectUploads = createSelector(
  selectTusUploadReducer,
  (tusUpload) => tusUpload.uploads
);
