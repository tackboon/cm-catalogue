import styles from "./not_found.module.scss";

const NotFound = () => {
  return (
    <div className={styles["container"]}>
      <img src="/images/not-found.jpeg" alt="not-found" />
    </div>
  );
};

export default NotFound;
