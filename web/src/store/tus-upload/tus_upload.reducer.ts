import { AnyAction } from "redux";
import {
  removeUpload,
  retryUpload,
  setUploadError,
  setUploadField,
  setUploadID,
  setUploadInstance,
  setUploadIsUploading,
  setUploadProgress,
  stopAndRemoveAllSuccess,
} from "./tus_upload.action";
import { UploadField } from "./tus_upload.types";

export type TusUploadState = {
  readonly uploads: {
    [key: string]: UploadField;
  };
};

const INITIAL_STATE: TusUploadState = {
  uploads: {},
};

export const tusUploadReducer = (
  state = INITIAL_STATE,
  action: AnyAction
): TusUploadState => {
  if (setUploadField.match(action)) {
    return {
      ...state,
      uploads: {
        ...state.uploads,
        [action.payload.key]: action.payload.uploadField,
      },
    };
  }

  if (setUploadIsUploading.match(action)) {
    return {
      ...state,
      uploads: {
        ...state.uploads,
        [action.payload.key]: {
          ...state.uploads[action.payload.key],
          isUploading: action.payload.status,
        },
      },
    };
  }

  if (setUploadProgress.match(action)) {
    return {
      ...state,
      uploads: {
        ...state.uploads,
        [action.payload.key]: {
          ...state.uploads[action.payload.key],
          progress: action.payload.progress,
        },
      },
    };
  }

  if (setUploadError.match(action)) {
    return {
      ...state,
      uploads: {
        ...state.uploads,
        [action.payload.key]: {
          ...state.uploads[action.payload.key],
          error: action.payload.error,
        },
      },
    };
  }

  if (setUploadID.match(action)) {
    return {
      ...state,
      uploads: {
        ...state.uploads,
        [action.payload.key]: {
          ...state.uploads[action.payload.key],
          id: action.payload.id,
        },
      },
    };
  }

  if (setUploadInstance.match(action)) {
    return {
      ...state,
      uploads: {
        ...state.uploads,
        [action.payload.key]: {
          ...state.uploads[action.payload.key],
          instance: action.payload.instance,
        },
      },
    };
  }

  if (removeUpload.match(action)) {
    const uploads = {
      ...state.uploads,
    };

    delete uploads[action.payload];

    return {
      ...state,
      uploads,
    };
  }

  if (retryUpload.match(action)) {
    return {
      ...state,
      uploads: {
        ...state.uploads,
        [action.payload]: {
          ...state.uploads[action.payload],
          error: "",
          isUploading: true,
          progress: 0,
        },
      },
    };
  }

  if (stopAndRemoveAllSuccess.match(action)) {
    return {
      ...state,
      uploads: {},
    };
  }

  return state;
};
