import { FC } from "react";
import { BsBook, BsCurrencyDollar, BsFillPencilFill } from "react-icons/bs";

import {
  CustomerData,
  CUSTOMER_RELATIONSHIP,
} from "../../store/customer/customer.types";

import styles from "./customer_row.module.scss";

type CustomerRowProps = {
  index: number;
  customer: CustomerData;
  openEditCustomer: (customer: CustomerData) => void;
  openAddCashBookRecord: (customer: CustomerData) => void;
  openCashBookHistory: (customer: CustomerData) => void;
};

const CustomerRow: FC<CustomerRowProps> = ({
  index,
  customer,
  openEditCustomer,
  openAddCashBookRecord,
  openCashBookHistory,
}) => {
  const handleEdit = () => {
    openEditCustomer(customer);
  };

  const handleAddRecord = () => {
    openAddCashBookRecord(customer);
  };

  const handleViewHistory = () => {
    openCashBookHistory(customer);
  };

  return (
    <div
      className={`${styles["row-container"]} ${
        customer.relationship === CUSTOMER_RELATIONSHIP.SUSPENDED
          ? styles["suspended"]
          : ""
      }`}
    >
      <div className={styles["col-index"]}>{index}.</div>
      <div className={styles["col-content"]}>
        <div className={styles["col-content_1"]}>
          <p className={styles["name"]}>{customer.name}</p>
          <p className={styles["total_unbilled_amount"]}>
            Total Unbilled Amount: RM{" "}
            {(Math.round(customer.total_unbilled_amount * 100) / 100).toFixed(
              2
            )}
          </p>
        </div>
        <div className={`${styles["col-content_2"]} d-none d-lg-block`}>
          <span>{customer.city !== "" ? customer.city + ", " : ""}</span>
          <span className="text-nowrap">{customer.state}</span>
        </div>
      </div>
      <div className={styles["col-action"]}>
        <button className={styles["btn"]} onClick={handleEdit}>
          <BsFillPencilFill />
          <span className="d-none d-lg-block">Edit</span>
        </button>

        <button className={styles["btn"]} onClick={handleAddRecord}>
          <BsCurrencyDollar />
          <span className="d-none d-lg-block">Add Record</span>
        </button>

        <button className={styles["btn"]} onClick={handleViewHistory}>
          <BsBook />
          <span className="d-none d-lg-block">Cash Book</span>
        </button>
      </div>
    </div>
  );
};

export default CustomerRow;
