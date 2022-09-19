import { ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { selectCategories } from "../../../store/category/category.selector";
import { setCategoryID } from "../../../store/product/product.action";

const useCategoryFilterHandler = (categoryID: number) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const categories = useSelector(selectCategories);
  const selectedCategory = categories.filter((c) => c.id === categoryID)[0];

  useEffect(() => {
    dispatch(setCategoryID(selectedCategory.id));
  }, [selectedCategory, dispatch]);

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) {
      // navigate to selected category page
      navigate(`/categories/${event.target.value}/products`);
    }
  };

  return {
    handleCategoryChange,
    selectedCategory,
    categories,
  };
};

export default useCategoryFilterHandler;
