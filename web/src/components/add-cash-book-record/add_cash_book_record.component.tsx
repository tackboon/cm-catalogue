import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { BsCalendarFill } from "react-icons/bs";
import { useForm } from "react-hook-form";
import DatePicker, { ReactDatePicker } from "react-datepicker";

import LoadingButton from "../loading-button/loading_button.component";
import { CustomerData } from "../../store/customer/customer.types";
import { addCashBookRecordStart } from "../../store/cashbook/cashbook.action";
import {
  CASH_BOOK_ERROR_TYPES,
  CASH_BOOK_LOADING_TYPES,
  CASH_BOOK_RECORD_TYPES,
} from "../../store/cashbook/cashbook.types";
import {
  selectCashBookError,
  selectCashBookIsLoading,
} from "../../store/cashbook/cashbook.selector";

import styles from "./add_cash_book_record.module.scss";

type AddCashBookRecordProp = {
  show: boolean;
  onClose: () => void;
  customer: CustomerData | undefined;
};

type AddCashBookRecordFormValues = {
  date: Date;
  type: CASH_BOOK_RECORD_TYPES;
  amount: number;
  description: string;
};

const AddCashBookRecord: FC<AddCashBookRecordProp> = ({
  show,
  onClose,
  customer,
}) => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { [CASH_BOOK_LOADING_TYPES.ADD_CASH_BOOK_RECORD]: isLoading } =
    useSelector(selectCashBookIsLoading);
  const { [CASH_BOOK_ERROR_TYPES.ADD_CASH_BOOK_RECORD]: cashBookError } =
    useSelector(selectCashBookError);
  const [startSubmit, setStartSubmit] = useState(false);
  const datePickerRef = useRef(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AddCashBookRecordFormValues>({
    defaultValues: {
      date: new Date(),
    },
  });

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, []);

  const handleDateChange = (date: Date) => {
    setValue("date", date);
    setSelectedDate(date);
  };

  const onFormSubmit = (data: AddCashBookRecordFormValues) => {
    if (customer) {
      dispatch(
        addCashBookRecordStart(
          customer.id,
          data.date,
          data.type,
          data.amount,
          data.description
        )
      );
      setStartSubmit(true);
    }
  };

  useEffect(() => {
    if (startSubmit && !isLoading && cashBookError === "") {
      handleClose();
    }
  }, [startSubmit, isLoading, cashBookError]);

  return (
    <Modal backdrop="static" show={show} onHide={handleClose}>
      <Modal.Header className="bg-warning">Add Cash Book Record</Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit(onFormSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Customer</Form.Label>
            <Form.Control value={customer?.name} disabled />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <div className={styles["date-picker-container"]}>
              <DatePicker
                ref={datePickerRef}
                className={styles["date-picker"]}
                dateFormat="dd MMM yyyy"
                showPopperArrow={false}
                selected={selectedDate}
                onChange={handleDateChange}
              />
              <BsCalendarFill
                className={styles["date-picker-icon"]}
                onClick={() => {
                  if (datePickerRef.current) {
                    const el = datePickerRef.current as ReactDatePicker;
                    el.setFocus();
                  }
                }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select {...register("type")}>
              <option value={CASH_BOOK_RECORD_TYPES.DEBIT}>
                Debit - 添加收款
              </option>
              <option value={CASH_BOOK_RECORD_TYPES.CREDIT}>
                Credit - 添加欠款
              </option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Amount<span className="text-danger">*</span>
            </Form.Label>
            <InputGroup>
              <InputGroup.Text>RM</InputGroup.Text>
              <Form.Control
                {...register("amount", {
                  required: "amount is required.",
                  min: {
                    value: 0.01,
                    message: "minimum amount is RM0.01.",
                  },
                })}
                type="number"
                min="0.01"
                max="1000000000.00"
                step="0.01"
                placeholder="100.00"
                isInvalid={!!errors.amount}
              />
            </InputGroup>
            <Form.Control.Feedback className="d-block" type="invalid">
              {errors.amount?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              {...register("description")}
              placeholder="Some reference here..."
              maxLength={50}
            />
          </Form.Group>

          <div className="invalid-feedback d-block">{cashBookError}</div>

          <div className={styles["add-cash-book-footer"]}>
            <LoadingButton
              title="Save"
              loadingTitle="Saving"
              isLoading={isLoading}
              variant="warning"
              type="submit"
            />
            <Button variant="danger" onClick={handleClose} className="ms-2">
              Close
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddCashBookRecord;
