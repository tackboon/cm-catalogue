import { FC, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  deleteCategoryStart,
  resetCategoryError,
} from "../../store/category/category.action";
import { selectCategorysLoading } from "../../store/category/category.selector";
import {
  CategoryData,
  CATEGORY_ERROR_TYPES,
  CATEGORY_LOADING_TYPES,
} from "../../store/category/category.types";
import { retryUpload } from "../../store/tus-upload/tus_upload.action";
import { selectUploads } from "../../store/tus-upload/tus_upload.selector";

import ImagePreview from "../image-preview/image_preview.component";
import ImageUploader from "../image-uploader/image_uploader.component";
import LoadingButton from "../loading-button/loading_button.component";
import styles from "./category_form.module.scss";

type CategoryFormValues = {
  name: string;
  zhName: string;
};

type CategoryFormProps = {
  onSubmit: (name: string, fileID: string) => void;
  error: string;
  isSubmitLoading: boolean;
  initData?: CategoryData;
};

const defaultValues = {
  name: "",
  zhName: "",
};

const imageInfo = {
  previewURL: "/images/no-photo-available.png",
  progress: 0,
  isUploading: false,
  isError: false,
  onRetry: () => {},
};

const CategoryForm: FC<CategoryFormProps> = ({
  onSubmit,
  error,
  isSubmitLoading,
  initData,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const uploads = useSelector(selectUploads);

  if (initData) {
    // process initial category name
    const items = initData.name.split(" - ");
    defaultValues.name = items[0];
    if (items.length > 1) {
      defaultValues.zhName = items[1];
    }

    // retrieve image from file server if file_id exist
    if (initData.file_id !== "") {
      imageInfo.previewURL = `${process.env.REACT_APP_UPLOADER_ENDPOINT}/${initData.file_id}`;
    }
  }

  // initialize react-hook-form
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<CategoryFormValues>({
    defaultValues,
  });

  // update image info if file upload happened
  const uploadKeys = Object.keys(uploads);
  if (uploadKeys.length > 0) {
    imageInfo.previewURL = URL.createObjectURL(uploads[uploadKeys[0]].file);
    imageInfo.progress = uploads[uploadKeys[0]].progress;
    imageInfo.isUploading = uploads[uploadKeys[0]].isUploading;
    imageInfo.isError = uploads[uploadKeys[0]].error !== "";
    imageInfo.onRetry = () => {
      dispatch(retryUpload(uploadKeys[0]));
    };
  }

  // handle form submit
  const [startSubmit, setStartSubmit] = useState(false);
  const onFormSubmit = (data: CategoryFormValues) => {
    setStartSubmit(true);
    const name =
      data.zhName === "" ? data.name : data.name + " - " + data.zhName;
    let fileID = initData?.file_id || "";
    const uploadKeys = Object.keys(uploads);
    if (uploadKeys.length > 0) {
      fileID = uploads[uploadKeys[0]].id;
    }
    onSubmit(name, fileID);
  };

  // handle delete category
  const { [CATEGORY_LOADING_TYPES.DELETE_CATEGORY]: isDeleteLoading } =
    useSelector(selectCategorysLoading);
  const [startDelete, setStartDelete] = useState(false);
  const handleDelete = () => {
    setStartDelete(true);
    const id = initData?.id || 0;
    dispatch(deleteCategoryStart(id));
  };

  // navigate to category list page after submit successful
  useEffect(() => {
    if (
      (startSubmit && !isSubmitLoading && error === "") ||
      (startDelete && !isDeleteLoading)
    ) {
      navigate("/categories");
    }
  }, [
    startSubmit,
    isSubmitLoading,
    error,
    startDelete,
    isDeleteLoading,
    navigate,
  ]);

  // clean up form on page unmount
  useEffect(() => {
    return () => {
      reset();
      dispatch(resetCategoryError(CATEGORY_ERROR_TYPES.ADD_CATEGORY));
      dispatch(resetCategoryError(CATEGORY_ERROR_TYPES.UPDATE_CATEGORY));
    };
  }, [dispatch, reset]);

  return (
    <Form onSubmit={handleSubmit(onFormSubmit)}>
      <div className={styles["category-form-container"]}>
        <div className={styles["image-container"]}>
          <div className={styles["image-wrapper"]}>
            <ImagePreview
              previewURL={imageInfo.previewURL}
              progress={imageInfo.progress}
              isUploading={imageInfo.isUploading}
              isError={imageInfo.isError}
              onRetry={imageInfo.onRetry}
            />
          </div>

          <ImageUploader
            multiUpload={false}
            className={styles["upload-button"]}
          />
        </div>

        <div className={styles["input-container"]}>
          <Form.Group className="mb-3">
            <Form.Label>
              Category Name<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              {...register("name", { required: "Name field is required." })}
              placeholder="e.g. Candies"
              maxLength={30}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-5">
            <Form.Label>分类名称</Form.Label>
            <Form.Control
              {...register("zhName")}
              placeholder="e.g. 糖果类"
              maxLength={10}
            />
          </Form.Group>

          <div className="invalid-feedback d-block">{error}</div>

          <div className={styles["category-form-footer"]}>
            <LoadingButton
              title="Delete"
              loadingTitle="Deleting..."
              isLoading={isDeleteLoading}
              variant="danger"
              className={`${styles["delete-button"]} ${
                initData ? "d-block" : "d-none"
              }`}
              onClick={handleDelete}
            />
            <LoadingButton
              title="Save"
              loadingTitle="Saving..."
              isLoading={isSubmitLoading}
              type="submit"
              variant="warning"
              className={styles["submit-button"]}
            />
          </div>
        </div>
      </div>
    </Form>
  );
};

export default CategoryForm;
