import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  AuthError,
  AuthErrorCodes,
  getAuth,
  NextOrObserver,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_APP_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

isSupported().then((res) => {
  if (res) getAnalytics(app);
});

export const signInUserWithEmailAndPassword = async (
  email: string,
  password: string
) => await signInWithEmailAndPassword(auth, email, password);

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback: NextOrObserver<User>) =>
  onAuthStateChanged(auth, callback);

export const firebaseAuthError = (error: AuthError): string => {
  let errorMessage = "";

  switch (error.code) {
    case AuthErrorCodes.INVALID_EMAIL:
      errorMessage = "Please provide a valid email.";
      break;
    case AuthErrorCodes.USER_DISABLED:
      errorMessage = "User account has been disabled.";
      break;
    case AuthErrorCodes.USER_DELETED:
    case AuthErrorCodes.INVALID_PASSWORD:
      errorMessage =
        "Password is invalid for given email. Please double check the email and password again.";
      break;
    default:
      errorMessage = "Authentication Error!";
  }

  return errorMessage;
};
