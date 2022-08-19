export enum USER_ACTION_TYPES {
  SET_CURRENT_SESSION = "user/SET_CURRENT_SESSION",
  SET_IS_USER_LOADING = "user/SET_IS_USER_LOADING",
  EMAIL_SIGN_IN_START = "user/EMAIL_SIGN_IN_START",
  SIGN_IN_SUCCESS = "user/SIGN_IN_SUCCESS",
  SIGN_IN_FAILED = "user/SIGN_IN_FAILED",
  SIGN_OUT_START = "user/SIGN_OUT_START",
  SIGN_OUT_SUCCESS = "user/SIGN_OUT_SUCCESS",
  SIGN_OUT_FAILED = "user/SIGN_OUT_FAILED",
}

export enum USER_LOADING_TYPES {
  SIGN_IN = "loading/SIGN_In",
}

export enum USER_ERROR_TYPES {
  SIGN_IN = "error/SIGN_In",
}

export type UserData = {
  email: string;
  displayName: string;
  role: string;
};
