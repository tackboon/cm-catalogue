import { FC } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import CustomerForm from "../customer-form/customer_form.component";
import { createCustomerDataStart } from "../../store/customer/customer.action";
import { CustomerFormValues } from "../customer-form/customer_form.component";
import {
  selectCustomerError,
  selectCustomerIsLoading,
} from "../../store/customer/customer.selector";
import {
  CUSTOMER_ERROR_TYPES,
  CUSTOMER_LOADING_TYPES,
} from "../../store/customer/customer.types";

type AddCustomerProps = {
  show: boolean;
  onClose: () => void;
};

const AddCustomer: FC<AddCustomerProps> = ({ show, onClose }) => {
  const dispatch = useDispatch();
  const {
    [CUSTOMER_LOADING_TYPES.CREATE_CUSTOMER_DATA]: createCustomerIsLoading,
  } = useSelector(selectCustomerIsLoading);
  const { [CUSTOMER_ERROR_TYPES.CREATE_CUSTOMER_DATA]: createCustomerError } =
    useSelector(selectCustomerError);

  const onSubmit = (data: CustomerFormValues) => {
    dispatch(createCustomerDataStart(data));
  };

  return (
    <Modal backdrop="static" show={show}>
      <Modal.Header className="bg-warning">
        Add Customer - 添加客户
      </Modal.Header>
      <Modal.Body>
        <CustomerForm
          onClose={onClose}
          onSubmit={onSubmit}
          submitError={createCustomerError}
          submitIsLoading={createCustomerIsLoading}
        />
      </Modal.Body>
    </Modal>
  );
};

export default AddCustomer;
