import { FC } from "react";
import { Button } from "react-bootstrap";

import { CustomerPagination } from "../../store/customer/customer.types";
import styles from "./custom_pagination.module.scss";

const enum PAGE_TYPE {
  NEXT = "next",
  PREV = "prev",
}

type CustomPaginationProps = {
  pagination: CustomerPagination;
  handlePagination: (page: number) => void;
};

const CustomPagination: FC<CustomPaginationProps> = ({
  pagination,
  handlePagination,
}) => {
  const offset = (pagination.page - 1) * pagination.limit;
  const handlePaginationClick = (type: PAGE_TYPE) => {
    const page =
      type === PAGE_TYPE.PREV ? pagination.page - 1 : pagination.page + 1;

    handlePagination(page);
  };

  return (
    <div className={styles["pagination-container"]}>
      <span>
        Showing {pagination.total_count === 0 ? 0 : offset + 1} to{" "}
        {offset + pagination.count} of {pagination.total_count} rows
      </span>
      <div
        className={`${styles["pagination"]} ${
          pagination.page === 1 &&
          offset + pagination.count >= pagination.total_count
            ? "d-none"
            : "d-block"
        }`}
      >
        <Button
          variant="warning"
          className={styles["prev"]}
          disabled={pagination.page === 1}
          onClick={() => handlePaginationClick(PAGE_TYPE.PREV)}
        >
          &lt; Prev
        </Button>
        <Button
          variant="warning"
          className={styles["next"]}
          disabled={offset + pagination.count >= pagination.total_count}
          onClick={() => handlePaginationClick(PAGE_TYPE.NEXT)}
        >
          Next &gt;
        </Button>
      </div>
    </div>
  );
};

export default CustomPagination;
