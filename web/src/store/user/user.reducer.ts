import { AnyAction } from "redux";

import {
  initErrorState,
  initLoadingState,
} from "../../utils/reducer/reducer.util";
import {
  setIsUserLoading,
  signInFailed,
  signInSuccess,
  signOutFailed,
  signOutSuccess,
} from "./user.action";
import { UserData, USER_ACTION_TYPES, USER_LOADING_TYPES } from "./user.types";

export type UserState = {
  readonly currentUser: UserData | null;
  readonly isLoading: { [key: string]: boolean };
  readonly error: { [key: string]: string };
};

const INITIAL_STATE: UserState = {
  currentUser: null,
  isLoading: initLoadingState(USER_LOADING_TYPES),
  error: initErrorState(USER_ACTION_TYPES),
};

export const userReducer = (
  state = INITIAL_STATE,
  action: AnyAction
): UserState => {
  if (setIsUserLoading.match(action)) {
    return {
      ...state,
      isLoading: {
        ...state.isLoading,
        [action.payload.type]: action.payload.isLoading,
      },
    };
  }

  if (signInSuccess.match(action)) {
    return {
      ...state,
      currentUser: action.payload,
      isLoading: { ...state.isLoading, [USER_LOADING_TYPES.SIGN_IN]: false },
      error: { ...state.error, [USER_ACTION_TYPES.SIGN_IN_FAILED]: "" },
    };
  }

  if (signInFailed.match(action)) {
    return {
      ...state,
      error: { ...state.error, [action.type]: action.payload },
      isLoading: { ...state.isLoading, [USER_LOADING_TYPES.SIGN_IN]: false },
    };
  }

  if (signOutSuccess.match(action)) {
    return {
      ...state,
      currentUser: null,
      error: { ...state.error, [USER_ACTION_TYPES.SIGN_OUT_FAILED]: "" },
    };
  }

  if (signOutFailed.match(action)) {
    return {
      ...state,
      error: {
        ...state.error,
        [action.type]: action.payload,
      },
    };
  }

  return state;
};