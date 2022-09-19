import { FC, useCallback, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { ProductPost } from "../../openapi/catalogue";
import { selectCategories } from "../../store/category/category.selector";
import {
  deleteProductStart,
  resetProductError,
} from "../../store/product/product.action";
import { selectProductIsLoading } from "../../store/product/product.selector";
import {
  ProductData,
  PRODUCT_ERROR_TYPE,
  PRODUCT_LOADING_TYPE,
  PRODUCT_STATUS_TYPE,
} from "../../store/product/product.types";
import { selectUploads } from "../../store/tus-upload/tus_upload.selector";
import ImagePreviewList from "../image-preview-list/image_preview_list.component";
import ImageUploader from "../image-uploader/image_uploader.component";
import LoadingButton from "../loading-button/loading_button.component";
import styles from "./product_form.module.scss";

export type ProductFormValues = {
  name: string;
  description: string;
  price: number;
  status: PRODUCT_STATUS_TYPE;
  categoryID: number;
};

type ProductFormProps = {
  onClose: () => void;
  onSubmit: (categoryID: number, data: ProductPost) => void;
  initData?: ProductData;
  categoryID: number;
  submitError: string;
  submitIsLoading: boolean;
};

const ProductForm: FC<ProductFormProps> = ({
  onClose,
  onSubmit,
  categoryID,
  initData,
  submitError,
  submitIsLoading,
}) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);

  // handle old product file
  const uploads = useSelector(selectUploads);
  const [selectedPreview, setSelectedPreview] = useState(
    initData ? initData.preview_id : ""
  );
  const [uploadedFileIDs, setUploadedFileIDs] = useState<string[]>(
    initData && initData.file_ids ? [...initData.file_ids] : []
  );

  // handle remove old product file
  const removeUploadedFiles = (fileID: string) => {
    setUploadedFileIDs(uploadedFileIDs.filter((id) => id !== fileID));
  };

  // initialize react-hook-form
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<ProductFormValues>({
    defaultValues: {
      categoryID: categoryID,
      name: initData?.name,
      description: initData?.description,
      price: initData?.price,
      status: initData?.status,
    },
  });

  // handle form submit
  const [startSubmit, setStartSubmit] = useState(false);
  const onFormSubmit = (data: ProductFormValues) => {
    const fileIDs: string[] = [];
    Object.keys(uploads).forEach((key) => {
      if (uploads[key].id !== "") {
        fileIDs.push(uploads[key].id);
      }
    });
    setStartSubmit(true);
    onSubmit(data.categoryID, {
      ...data,
      price: data.price * 1,
      preview_id: selectedPreview,
      // combine new upload file with old product file
      file_ids: [...fileIDs, ...uploadedFileIDs],
    });
  };

  // handle delete product
  const [startDelete, setStartDelete] = useState(false);
  const { [PRODUCT_LOADING_TYPE.DELETE_PRODUCT]: isDeleteLoading } =
    useSelector(selectProductIsLoading);
  const handleDelete = () => {
    if (initData) {
      setStartDelete(true);
      dispatch(deleteProductStart(categoryID, initData.id));
    }
  };

  // clean up form and close dialog
  const handleClose = useCallback(() => {
    reset();
    dispatch(resetProductError(PRODUCT_ERROR_TYPE.ADD_PRODUCT));
    dispatch(resetProductError(PRODUCT_ERROR_TYPE.UPDATE_PRODUCT));
    onClose();
  }, [reset, dispatch, onClose]);

  // trigger close if submit success
  useEffect(() => {
    if (
      (startSubmit && submitError === "" && !submitIsLoading) ||
      (startDelete && !isDeleteLoading)
    ) {
      handleClose();
    }
  }, [
    startSubmit,
    submitError,
    submitIsLoading,
    startDelete,
    isDeleteLoading,
    handleClose,
  ]);

  return (
    <Form noValidate onSubmit={handleSubmit(onFormSubmit)}>
      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        <Form.Select
          {...register("categoryID")}
          defaultValue={categoryID}
          disabled={!!initData}
        >
          {categories.map((category) => (
            <option value={category.id} key={category.id}>
              {category.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>
          Product Name<span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          {...register("name", {
            required: "Name field is required.",
          })}
          placeholder="Enter product name"
          maxLength={50}
          isInvalid={!!errors.name}
        />
        <Form.Control.Feedback type="invalid">
          {errors.name?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          {...register("description")}
          maxLength={200}
          placeholder="e.g. Spicy flavour - 10 * 60g"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Price</Form.Label>
        <Form.Control
          {...register("price", {
            required: "price is required.",
            min: {
              value: 0.01,
              message: "minimum price is RM0.01.",
            },
          })}
          type="number"
          min="0.01"
          max="1000000000.00"
          step="0.01"
          placeholder="100.00"
          isInvalid={!!errors.price}
        />
        <Form.Control.Feedback type="invalid">
          {errors.price?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Status</Form.Label>
        <Form.Select {...register("status")}>
          <option value={PRODUCT_STATUS_TYPE.IN_STOCK}>
            In Stock - 有库存
          </option>
          <option value={PRODUCT_STATUS_TYPE.OUT_OF_STOCK}>
            Out of Stock - 无库存
          </option>
        </Form.Select>
      </Form.Group>

      <div className={`${styles["upload-wrapper"]} mb-3`}>
        <label>Product Images</label>
        <ImageUploader multiUpload={true} className={styles["upload-button"]} />
        <ImagePreviewList
          selectedPreview={selectedPreview}
          setSelectedPreview={setSelectedPreview}
          uploadedFiles={uploadedFileIDs}
          removeUploadedFiles={removeUploadedFiles}
        />
      </div>

      <div className="invalid-feedback d-block">{submitError}</div>

      <div className={styles["product-form-footer"]}>
        <div>
          {initData ? (
            <LoadingButton
              variant="danger"
              title="Delete"
              loadingTitle="Deleting..."
              isLoading={false}
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

export default ProductForm;
