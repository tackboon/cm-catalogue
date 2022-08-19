import { FC } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateCustomerDataStart } from "../../store/customer/customer.action";
import {
  selectCustomerError,
  selectCustomerIsLoading,
} from "../../store/customer/customer.selector";
import {
  CustomerData,
  CUSTOMER_ERROR_TYPES,
  CUSTOMER_LOADING_TYPES,
} from "../../store/customer/customer.types";

import CustomerForm, {
  CustomerFormValues,
} from "../customer-form/customer_form.component";

type EditCustomerProps = {
  show: boolean;
  onClose: () => void;
  customer: CustomerData | undefined;
};

const EditCustomer: FC<EditCustomerProps> = ({ show, onClose, customer }) => {
  const dispatch = useDispatch();
  const {
    [CUSTOMER_LOADING_TYPES.UPDATE_CUSTOMER_DATA]: createCustomerIsLoading,
  } = useSelector(selectCustomerIsLoading);
  const { [CUSTOMER_ERROR_TYPES.UPDATE_CUSTOMER_DATA]: createCustomerError } =
    useSelector(selectCustomerError);

  const onSubmit = (data: CustomerFormValues) => {
    if (customer !== undefined) {
      dispatch(updateCustomerDataStart(customer.id, data));
    }
  };

  return (
    <Modal backdrop="static" show={show}>
      <Modal.Header className="bg-warning">
        Edit Customer - 修改客户
      </Modal.Header>
      <Modal.Body>
        <CustomerForm
          onClose={onClose}
          onSubmit={onSubmit}
          initData={customer}
          submitError={createCustomerError}
          submitIsLoading={createCustomerIsLoading}
        />
      </Modal.Body>
    </Modal>
  );
};

export default EditCustomer;
