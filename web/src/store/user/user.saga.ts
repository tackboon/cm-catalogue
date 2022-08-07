import { all, call, put, takeLatest } from "typed-redux-saga/macro";
import { AuthError } from "firebase/auth";

import {
  firebaseAuthError,
  signInUserWithEmailAndPassword,
  signOutUser,
} from "../../utils/firebase/firebase.utils";
import {
  EmailSignInStart,
  SetCurrentSession,
  setIsUserLoading,
  signInFailed,
  signInSuccess,
  signOutFailed,
  signOutSuccess,
} from "./user.action";
import { USER_ACTION_TYPES, USER_LOADING_TYPES } from "./user.types";
import { api } from "../../service/openapi/openapi.service";

export function* updateSession({ payload: token }: SetCurrentSession) {
  try {
    api.setAuthConfig(token);

    if (token) {
      const res = yield* call([api.UserAPI, api.UserAPI.getCurrentUser]);
      yield* put(
        signInSuccess({
          email: res.data.email,
          displayName: res.data.display_name,
          role: res.data.role,
        })
      );
    }
  } catch (error) {
    yield* put(
      signInFailed("Failed to load auth session. Please try again later.")
    );
  }
}

export function* signInWithEmail({
  payload: { email, password },
}: EmailSignInStart) {
  try {
    yield* put(setIsUserLoading(USER_LOADING_TYPES.SIGN_IN, true));
    yield* call(signInUserWithEmailAndPassword, email, password);
  } catch (error) {
    const msg = firebaseAuthError(error as AuthError);
    yield* put(signInFailed(msg));
  }
}

export function* signOut() {
  try {
    yield* call(signOutUser);
    yield* put(signOutSuccess());
  } catch (error) {
    yield* put(signOutFailed((error as Error).message));
  }
}

export function* onSetCurrentSession() {
  yield* takeLatest(USER_ACTION_TYPES.SET_CURRENT_SESSION, updateSession);
}

export function* onEmailSignInStart() {
  yield* takeLatest(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* onSignOutStart() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_OUT_START, signOut);
}

export function* userSagas() {
  yield* all([
    call(onSetCurrentSession),
    call(onEmailSignInStart),
    call(onSignOutStart),
  ]);
}
