import { FC, useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { BsCalendarFill, BsFillTrashFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCashBookRecordStart,
  fetchCashBookRecordStart,
} from "../../store/cashbook/cashbook.action";
import { selectCashBookRecords } from "../../store/cashbook/cashbook.selector";
import { CASH_BOOK_RECORD_TYPES } from "../../store/cashbook/cashbook.types";
import { CustomerData } from "../../store/customer/customer.types";

import styles from "./cash_book_history.module.scss";

type CashBookHistoryProps = {
  show: boolean;
  onClose: () => void;
  customer: CustomerData | undefined;
};

const CashBookHistory: FC<CashBookHistoryProps> = ({
  show,
  onClose,
  customer,
}) => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const cashBookRecords = useSelector(selectCashBookRecords);

  const handleClose = () => {
    onClose();
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleDeleteRecord = (
    id: number,
    type: CASH_BOOK_RECORD_TYPES,
    amount: number
  ) => {
    if (customer) {
      dispatch(deleteCashBookRecordStart(customer.id, id, type, amount));
    }
  };

  useEffect(() => {
    if (customer && show) {
      const firstDay = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      );
      const lastDay = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0
      );
      dispatch(fetchCashBookRecordStart(customer.id, firstDay, lastDay));
    }
  }, [show, customer, selectedDate]);

  return (
    <Modal backdrop="static" show={show} size="xl">
      <Modal.Header className="bg-warning">
        Cash Book Records - 记账本
      </Modal.Header>
      <Modal.Body>
        <p>Customer: {customer?.name}</p>

        <label>Select Month:</label>
        <div className={styles["month-picker-container"]}>
          <DatePicker
            className={styles["month-picker"]}
            dateFormat="MMM yyyy"
            showPopperArrow={false}
            selected={selectedDate}
            onChange={handleDateChange}
            showMonthYearPicker
          />
          <BsCalendarFill className={styles["month-picker-icon"]} />
        </div>

        <Table hover className="mt-5">
          <thead>
            <tr className="text-center">
              <th>Date</th>
              <th>Description</th>
              <th>Amount (RM)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cashBookRecords.map((record) => (
              <tr key={record.id}>
                <td className="text-center">
                  {record.date.toLocaleString("en-MY", {
                    dateStyle: "medium",
                  })}
                </td>
                <td>{record.description}</td>
                <td
                  className={`${
                    record.type === CASH_BOOK_RECORD_TYPES.CREDIT
                      ? "text-danger"
                      : "text-success"
                  } text-center`}
                >
                  {record.type === CASH_BOOK_RECORD_TYPES.CREDIT ? "-" : "+"}
                  {record.amount.toFixed(2)}
                </td>
                <td className="text-center">
                  <BsFillTrashFill
                    className={styles["delete-record"]}
                    onClick={() =>
                      handleDeleteRecord(record.id, record.type, record.amount)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CashBookHistory;
