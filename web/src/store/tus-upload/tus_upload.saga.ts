import { all, call, put, select, takeLatest } from "typed-redux-saga/macro";
import { Upload } from "tus-js-client";

import {
  AddUpload,
  RetryUpload,
  setUploadError,
  setUploadField,
  setUploadID,
  setUploadInstance,
  setUploadIsUploading,
  setUploadProgress,
  stopAndRemoveAllSuccess,
  stopUpload,
  StopUpload,
} from "./tus_upload.action";
import { TUS_UPLOAD_ACTION_TYPES } from "./tus_upload.types";
import { selectUserToken } from "../user/user.selector";
import { store } from "../store";
import { selectUploads } from "./tus_upload.selector";

export function* createTusUpload(file: File, key: string) {
  const token = yield* select(selectUserToken);

  const tusUpload = new Upload(file, {
    endpoint: process.env.REACT_APP_UPLOADER_ENDPOINT,
    retryDelays: [0, 1000, 3000, 5000],
    headers: {
      Authorization: "Bearer " + token,
    },
    onError: (err) => {
      store.dispatch(setUploadError(key, err.message));
      store.dispatch(setUploadIsUploading(key, false));
    },
    onProgress: (bytesUploaded, bytesTotal) => {
      store.dispatch(setUploadProgress(key, bytesUploaded / bytesTotal));
    },
    onSuccess: () => {
      if (tusUpload.url) {
        const items = tusUpload.url.split("/");
        store.dispatch(setUploadID(key, items[items.length - 1]));
      }
      store.dispatch(setUploadIsUploading(key, false));
    },
  });

  return tusUpload;
}

export function* addTusUpload({ payload }: AddUpload) {
  const key = Math.floor(Math.random() * 1000000) + "_" + Date.now();
  const tusUpload = yield* call(createTusUpload, payload, key);

  yield* put(
    setUploadField(key, {
      id: "",
      file: payload,
      progress: 0,
      isUploading: true,
      error: "",
      instance: tusUpload,
    })
  );

  // const prevUploads = yield* call([tusUpload, tusUpload.findPreviousUploads]);
  // if (prevUploads.length > 0) {
  //   yield* call(
  //     [tusUpload, tusUpload.resumeFromPreviousUpload],
  //     prevUploads[0]
  //   );
  // }
  yield* call([tusUpload, tusUpload.start]);
}

export function* stopTusUpload({ payload }: StopUpload) {
  const uploads = yield* select(selectUploads);
  const tusUpload = uploads[payload].instance;
  if (tusUpload) {
    yield* call([tusUpload, tusUpload.abort], false);
  }
}

export function* retryTusUpload({ payload }: RetryUpload) {
  const uploads = yield* select(selectUploads);
  const file = uploads[payload].file;
  const tusUpload = yield* call(createTusUpload, file, payload);

  yield* put(setUploadInstance(payload, tusUpload));

  const prevUploads = yield* call([tusUpload, tusUpload.findPreviousUploads]);
  if (prevUploads.length > 0) {
    yield* call(
      [tusUpload, tusUpload.resumeFromPreviousUpload],
      prevUploads[0]
    );
  }
  yield* call([tusUpload, tusUpload.start]);
}

export function* stopAndRemoveAll() {
  const uploads = yield* select(selectUploads);
  const uploadKeys = Object.keys(uploads);

  yield* all(uploadKeys.map((key) => put(stopUpload(key))));
  yield* put(stopAndRemoveAllSuccess());
}

export function* onAddTusUpload() {
  yield* takeLatest(TUS_UPLOAD_ACTION_TYPES.ADD_UPLOAD, addTusUpload);
}

export function* onStopTusUpload() {
  yield* takeLatest(TUS_UPLOAD_ACTION_TYPES.STOP_UPLOAD, stopTusUpload);
}

export function* onRetryTusUpload() {
  yield* takeLatest(TUS_UPLOAD_ACTION_TYPES.RETRY_UPLOAD, retryTusUpload);
}

export function* onStopAndRemoveAllStart() {
  yield* takeLatest(
    TUS_UPLOAD_ACTION_TYPES.STOP_AND_REMOVE_ALL_START,
    stopAndRemoveAll
  );
}

export function* tusUploadSagas() {
  yield* all([
    call(onAddTusUpload),
    call(onStopTusUpload),
    call(onRetryTusUpload),
    call(onStopAndRemoveAllStart),
  ]);
}
