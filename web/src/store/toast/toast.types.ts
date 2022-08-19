export enum TOAST_ACTION_TYPES {
  ADD_TOAST = "toast/ADD_TOAST",
  REMOVE_TOAST = "toast/REMOVE_TOAST",
}

export enum TOAST_BACKGROUND_TYPE {
  SUCCESS = "success",
  WARNING = "warning",
  DANGER = "danger",
}

export type ToastData = {
  id: number;
  type: TOAST_BACKGROUND_TYPE;
  title: string;
  message: string;
};
