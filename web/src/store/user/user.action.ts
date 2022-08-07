import {
  Action,
  ActionWithPayload,
  createAction,
  withMatcher,
} from "../../utils/reducer/reducer.util";
import { UserData, USER_ACTION_TYPES, USER_LOADING_TYPES } from "./user.types";

export type SetCurrentSession = ActionWithPayload<
  USER_ACTION_TYPES.SET_CURRENT_SESSION,
  string
>;

export type SetIsUserLoading = ActionWithPayload<
  USER_ACTION_TYPES.SET_IS_USER_LOADING,
  { type: USER_LOADING_TYPES; isLoading: boolean }
>;

export type EmailSignInStart = ActionWithPayload<
  USER_ACTION_TYPES.EMAIL_SIGN_IN_START,
  { email: string; password: string }
>;

export type SignInSuccess = ActionWithPayload<
  USER_ACTION_TYPES.SIGN_IN_SUCCESS,
  UserData
>;

export type SignInFailed = ActionWithPayload<
  USER_ACTION_TYPES.SIGN_IN_FAILED,
  string
>;

export type SignOutStart = Action<USER_ACTION_TYPES.SIGN_OUT_START>;

export type SignOutSuccess = Action<USER_ACTION_TYPES.SIGN_OUT_SUCCESS>;

export type SignOutFailed = ActionWithPayload<
  USER_ACTION_TYPES.SIGN_OUT_FAILED,
  string
>;

export const setCurrentSession = withMatcher(
  (token: string): SetCurrentSession =>
    createAction(USER_ACTION_TYPES.SET_CURRENT_SESSION, token)
);

export const setIsUserLoading = withMatcher(
  (type: USER_LOADING_TYPES, isLoading: boolean): SetIsUserLoading =>
    createAction(USER_ACTION_TYPES.SET_IS_USER_LOADING, { type, isLoading })
);

export const emailSignInStart = withMatcher(
  (email: string, password: string): EmailSignInStart =>
    createAction(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, { email, password })
);

export const signInSuccess = withMatcher(
  (user: UserData): SignInSuccess =>
    createAction(USER_ACTION_TYPES.SIGN_IN_SUCCESS, user)
);

export const signInFailed = withMatcher(
  (error: string): SignInFailed =>
    createAction(USER_ACTION_TYPES.SIGN_IN_FAILED, error)
);

export const signOutStart = withMatcher(
  (): SignOutStart => createAction(USER_ACTION_TYPES.SIGN_OUT_START)
);

export const signOutSuccess = withMatcher(
  (): SignOutSuccess => createAction(USER_ACTION_TYPES.SIGN_OUT_SUCCESS)
);

export const signOutFailed = withMatcher(
  (error: string): SignOutFailed =>
    createAction(USER_ACTION_TYPES.SIGN_OUT_FAILED, error)
);
