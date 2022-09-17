import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import CategoryForm from "../../components/category-form/category_form.component";
import { RootState } from "../../store/store";
import { updateCategoryStart } from "../../store/category/category.action";
import {
  selectCategoryByID,
  selectCategoryError,
  selectCategorysLoading,
} from "../../store/category/category.selector";
import {
  CATEGORY_ERROR_TYPES,
  CATEGORY_LOADING_TYPES,
} from "../../store/category/category.types";
import styles from "./edit_category.module.scss";

const EditCategory = () => {
  const params = useParams();
  let categoryID = 0;
  if (params.id) {
    categoryID = parseInt(params.id);
  }

  const dispatch = useDispatch();
  const { [CATEGORY_LOADING_TYPES.UPDATE_CATEGORY]: isLoading } = useSelector(
    selectCategorysLoading
  );
  const { [CATEGORY_ERROR_TYPES.UPDATE_CATEGORY]: submitError } =
    useSelector(selectCategoryError);

  const category = useSelector((state: RootState) =>
    selectCategoryByID(state, categoryID)
  );

  const initData = {
    id: 0,
    name: "",
    file_id: "",
  };

  if (category.length > 0) {
    initData.id = category[0].id;
    initData.name = category[0].name;
    initData.file_id = category[0].file_id;
  }

  const handleSubmit = (name: string, fileID: string) => {
    dispatch(updateCategoryStart({ id: categoryID, name, file_id: fileID }));
  };

  return (
    <Container>
      <div className={styles["edit-category-header"]}>
        <h1>Edit Category - 编辑分类</h1>
      </div>

      <CategoryForm
        onSubmit={handleSubmit}
        error={submitError}
        isSubmitLoading={isLoading}
        initData={initData}
      />
    </Container>
  );
};

export default EditCategory;
