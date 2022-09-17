import { Upload } from "tus-js-client";

export enum TUS_UPLOAD_ACTION_TYPES {
  SET_UPLOAD_FIELD = "tus_upload/SET_UPLOAD_FIELD",
  SET_UPLOAD_IS_UPLOADING = "tus_upload/SET_UPLOAD_IS_UPLOADING",
  SET_UPLOAD_PROGRESS = "tus_upload/SET_UPLOAD_PROGRESS",
  SET_UPLOAD_ERROR = "tus_upload/SET_UPLOAD_ERROR",
  SET_UPLOAD_ID = "tus_upload/SET_UPLOAD_ID",
  SET_UPLOAD_INSTANCE = "tus_upload/SET_UPLOAD_INSTANCE",
  ADD_UPLOAD = "tus_upload/ADD_UPLOAD",
  STOP_UPLOAD = "tus_upload/STOP_UPLOAD",
  REMOVE_UPLOAD = "tus_upload/REMOVE_UPLOAD",
  RETRY_UPLOAD = "tus_upload/RETRY_UPLOAD",
  STOP_AND_REMOVE_ALL_START = "tus_upload/STOP_AND_REMOVE_ALL_START",
  STOP_AND_REMOVE_ALL_SUCCESS = "tus_upload/STOP_AND_REMOVE_ALL_SUCCESS",
}

export type UploadField = {
  id: string;
  file: File;
  progress: number;
  isUploading: boolean;
  error: string;
  instance: Upload;
};
