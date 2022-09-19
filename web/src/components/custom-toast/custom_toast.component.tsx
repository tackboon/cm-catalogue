import { useCallback, useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { removeToast } from "../../store/toast/toast.action";
import { selectToasts } from "../../store/toast/toast.selector";

import styles from "./custom_toast.module.scss";

const CustomToast = () => {
  const dispatch = useDispatch();
  const toastList = useSelector(selectToasts);
  const [toastElements, setToastElements] = useState<JSX.Element[]>([]);

  const handleClose = useCallback(
    (toastID: number) => {
      dispatch(removeToast(toastID));
    },
    [dispatch]
  );

  useEffect(() => {
    setToastElements(
      toastList.map((toast) => {
        return (
          <Toast
            key={toast.id}
            bg={toast.type}
            autohide={true}
            onClose={() => handleClose(toast.id)}
          >
            <Toast.Header>
              <strong className="me-auto">{toast.title}</strong>
            </Toast.Header>
            <Toast.Body
              className={toast.type === "warning" ? "text-dark" : "text-light"}
            >
              {toast.message}
            </Toast.Body>
          </Toast>
        );
      })
    );
  }, [toastList, handleClose]);

  return (
    <ToastContainer className={styles["toast-container"]}>
      {toastElements}
    </ToastContainer>
  );
};

export default CustomToast;
