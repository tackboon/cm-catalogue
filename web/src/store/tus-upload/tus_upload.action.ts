import { Upload } from "tus-js-client";
import {
  Action,
  ActionWithPayload,
  createAction,
  withMatcher,
} from "../../utils/reducer/reducer.util";
import { UploadField, TUS_UPLOAD_ACTION_TYPES } from "./tus_upload.types";

export type SetUploadField = ActionWithPayload<
  TUS_UPLOAD_ACTION_TYPES.SET_UPLOAD_FIELD,
  {
    key: string;
    uploadField: UploadField;
  }
>;

export type SetUploadIsUploading = ActionWithPayload<
  TUS_UPLOAD_ACTION_TYPES.SET_UPLOAD_IS_UPLOADING,
  {
    key: string;
    status: boolean;
  }
>;

export type SetUploadProgress = ActionWithPayload<
  TUS_UPLOAD_ACTION_TYPES.SET_UPLOAD_PROGRESS,
  {
    key: string;
    progress: number;
  }
>;

export type SetUploadError = ActionWithPayload<
  TUS_UPLOAD_ACTION_TYPES.SET_UPLOAD_ERROR,
  {
    key: string;
    error: string;
  }
>;

export type SetUploadID = ActionWithPayload<
  TUS_UPLOAD_ACTION_TYPES.SET_UPLOAD_ID,
  {
    key: string;
    id: string;
  }
>;

export type SetUploadInstance = ActionWithPayload<
  TUS_UPLOAD_ACTION_TYPES.SET_UPLOAD_INSTANCE,
  {
    key: string;
    instance: Upload;
  }
>;

export type AddUpload = ActionWithPayload<
  TUS_UPLOAD_ACTION_TYPES.ADD_UPLOAD,
  File
>;

export type StopUpload = ActionWithPayload<
  TUS_UPLOAD_ACTION_TYPES.STOP_UPLOAD,
  string
>;

export type RemoveUpload = ActionWithPayload<
  TUS_UPLOAD_ACTION_TYPES.REMOVE_UPLOAD,
  string
>;

export type RetryUpload = ActionWithPayload<
  TUS_UPLOAD_ACTION_TYPES.RETRY_UPLOAD,
  string
>;

export type StopAndRemoveAllStart =
  Action<TUS_UPLOAD_ACTION_TYPES.STOP_AND_REMOVE_ALL_START>;

export type StopAndRemoveAllSuccess =
  Action<TUS_UPLOAD_ACTION_TYPES.STOP_AND_REMOVE_ALL_SUCCESS>;

export const setUploadField = withMatcher(
  (key: string, uploadField: UploadField): SetUploadField =>
    createAction(TUS_UPLOAD_ACTION_TYPES.SET_UPLOAD_FIELD, {
      key,
      uploadField,
    })
);

export const setUploadIsUploading = withMatcher(
  (key: string, status: boolean): SetUploadIsUploading =>
    createAction(TUS_UPLOAD_ACTION_TYPES.SET_UPLOAD_IS_UPLOADING, {
      key,
      status,
    })
);

export const setUploadProgress = withMatcher(
  (key: string, progress: number): SetUploadProgress =>
    createAction(TUS_UPLOAD_ACTION_TYPES.SET_UPLOAD_PROGRESS, {
      key,
      progress,
    })
);

export const setUploadError = withMatcher(
  (key: string, error: string): SetUploadError =>
    createAction(TUS_UPLOAD_ACTION_TYPES.SET_UPLOAD_ERROR, {
      key,
      error,
    })
);

export const setUploadID = withMatcher(
  (key: string, id: string): SetUploadID =>
    createAction(TUS_UPLOAD_ACTION_TYPES.SET_UPLOAD_ID, {
      key,
      id,
    })
);

export const setUploadInstance = withMatcher(
  (key: string, instance: Upload): SetUploadInstance =>
    createAction(TUS_UPLOAD_ACTION_TYPES.SET_UPLOAD_INSTANCE, {
      key,
      instance,
    })
);

export const addUpload = withMatcher(
  (file: File): AddUpload =>
    createAction(TUS_UPLOAD_ACTION_TYPES.ADD_UPLOAD, file)
);

export const stopUpload = withMatcher(
  (key: string): StopUpload =>
    createAction(TUS_UPLOAD_ACTION_TYPES.STOP_UPLOAD, key)
);

export const removeUpload = withMatcher(
  (key: string): RemoveUpload =>
    createAction(TUS_UPLOAD_ACTION_TYPES.REMOVE_UPLOAD, key)
);

export const retryUpload = withMatcher(
  (key: string): RetryUpload =>
    createAction(TUS_UPLOAD_ACTION_TYPES.RETRY_UPLOAD, key)
);

export const stopAndRemoveAllStart = withMatcher(
  (): StopAndRemoveAllStart =>
    createAction(TUS_UPLOAD_ACTION_TYPES.STOP_AND_REMOVE_ALL_START)
);

export const stopAndRemoveAllSuccess = withMatcher(
  (): StopAndRemoveAllSuccess =>
    createAction(TUS_UPLOAD_ACTION_TYPES.STOP_AND_REMOVE_ALL_SUCCESS)
);
