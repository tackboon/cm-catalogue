import { FC, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import LoadingButton from "../loading-button/loading_button.component";
import { selectCustomerIsLoading } from "../../store/customer/customer.selector";
import CustomInput, {
  CustomInputType,
} from "../custom-input/custom_input.component";
import {
  CustomerData,
  CUSTOMER_ERROR_TYPES,
  CUSTOMER_LOADING_TYPES,
  CUSTOMER_RELATIONSHIP,
} from "../../store/customer/customer.types";
import {
  deleteCustomerDataStart,
  resetCustomerError,
} from "../../store/customer/customer.action";

import styles from "./customer_form.module.scss";

export type CustomerFormValues = {
  name: string;
  relationship: CUSTOMER_RELATIONSHIP;
  code?: string;
  contact?: string;
  address?: string;
  postcode?: string;
  city?: string;
  state?: string;
};

type CustomerFormProps = {
  onClose: () => void;
  onSubmit: (data: CustomerFormValues) => void;
  initData?: CustomerData;
  submitError: string;
  submitIsLoading: boolean;
};

const CustomerForm: FC<CustomerFormProps> = ({
  onClose,
  onSubmit,
  initData,
  submitError,
  submitIsLoading,
}) => {
  const dispatch = useDispatch();
  const [startSubmit, setStartSubmit] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<CustomerFormValues>({
    defaultValues: {
      name: initData?.name,
      relationship: initData?.relationship,
      code: initData?.code,
      contact: initData?.contact,
      address: initData?.address,
      postcode: initData?.postcode,
      city: initData?.city,
      state: initData?.state,
    },
  });

  const onFormSubmit = (data: CustomerFormValues) => {
    onSubmit(data);
    setStartSubmit(true);
  };

  const handleClose = useCallback(() => {
    reset();
    dispatch(resetCustomerError(CUSTOMER_ERROR_TYPES.CREATE_CUSTOMER_DATA));
    dispatch(resetCustomerError(CUSTOMER_ERROR_TYPES.UPDATE_CUSTOMER_DATA));
    onClose();
  }, []);

  const [startDelete, setStartDelete] = useState(false);

  const { [CUSTOMER_LOADING_TYPES.DELETE_CUSTOMER_DATA]: isDeleteLoading } =
    useSelector(selectCustomerIsLoading);

  const handleDelete = () => {
    if (initData) {
      setStartDelete(true);
      dispatch(deleteCustomerDataStart(initData.id));
    }
  };

  useEffect(() => {
    if (
      (startSubmit && submitError === "" && !submitIsLoading) ||
      (startDelete && !isDeleteLoading)
    ) {
      handleClose();
    }
  }, [startSubmit, submitError, submitIsLoading, startDelete, isDeleteLoading]);

  return (
    <Form noValidate onSubmit={handleSubmit(onFormSubmit)}>
      <Form.Group className="mb-3">
        <Form.Label>
          Customer Name<span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          {...register("name", {
            required: "Name field is required.",
          })}
          placeholder="Enter customer name"
          maxLength={100}
          isInvalid={!!errors.name}
        />
        <Form.Control.Feedback type="invalid">
          {errors.name?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Code</Form.Label>
        <CustomInput
          customInputType={CustomInputType.ALPHA_NUMERIC}
          {...register("code")}
          maxLength={10}
          placeholder="e.g. AB001"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Contact</Form.Label>
        <CustomInput
          customInputType={CustomInputType.NUMERIC}
          {...register("contact", {
            pattern: {
              value: /^(01)[02-46-9][0-9]{7}$|^(01)[1][0-9]{8}$/g,
              message: "Please enter a valid contact.",
            },
          })}
          minLength={10}
          maxLength={11}
          isInvalid={!!errors.contact}
          placeholder="e.g. 0123456789"
        />
        <Form.Control.Feedback type="invalid">
          {errors.contact?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Address</Form.Label>
        <Form.Control
          {...register("address")}
          maxLength={200}
          placeholder="e.g. Kampung Baru Ayer Kuning"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Postcode</Form.Label>
        <CustomInput
          customInputType={CustomInputType.NUMERIC}
          {...register("postcode")}
          maxLength={5}
          placeholder="e.g. 31950"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>City</Form.Label>
        <CustomInput
          customInputType={CustomInputType.ALPHA}
          {...register("city")}
          maxLength={30}
          placeholder="e.g. Kampar"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>State</Form.Label>
        <CustomInput
          customInputType={CustomInputType.ALPHA}
          {...register("state")}
          maxLength={30}
          placeholder="e.g. Perak"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Relationship</Form.Label>
        <Form.Select {...register("relationship")}>
          <option value={CUSTOMER_RELATIONSHIP.IN_COOPERATION}>
            In Cooperation - 合作中
          </option>
          <option value={CUSTOMER_RELATIONSHIP.SUSPENDED}>
            Suspended - 暂停合作
          </option>
        </Form.Select>
      </Form.Group>

      <div className="invalid-feedback d-block">{submitError}</div>

      <div className={styles["customer-form-footer"]}>
        <div>
          {initData ? (
            <LoadingButton
              variant="danger"
              title="Delete"
              loadingTitle="Deleting..."
              isLoading={isDeleteLoading}
              onClick={handleDelete}
            />
          ) : (
            ""
          )}
        </div>
        <div>
          <LoadingButton
            variant="warning"
            title="Save"
            loadingTitle="Saving..."
            isLoading={submitIsLoading}
            type="submit"
          />
          <Button variant="danger" className="ms-2" onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default CustomerForm;
