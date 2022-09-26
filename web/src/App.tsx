import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Routes, Route } from "react-router-dom";

import { onAuthStateChangedListener } from "./utils/firebase/firebase.utils";
import { setCurrentSession } from "./store/user/user.action";
import { selectCurrentUser } from "./store/user/user.selector";
import ProtectedRoute, { ProtectedRouteProps } from "./route/guard";
import NavigationLayout from "./layout/navigation-layout/navigation_layout.component";
import SignIn from "./pages/sign-in/sign_in.component";
import Category from "./pages/category/category.component";
import AddCategory from "./pages/add-category/add_category.component";
import Customer from "./pages/customer/customer.component";
import CustomToast from "./components/custom-toast/custom_toast.component";
import EditCategory from "./pages/edit-category/edit_category.component";
import Product from "./pages/product/product.component";
import NotFound from "./pages/not-found/not_found.component";

const App = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (userAuth) => {
      let token = "";
      if (userAuth) token = await userAuth.getIdToken();
      dispatch(setCurrentSession(token));
    });

    return unsubscribe;
  }, [dispatch]);

  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, "outlet"> = {
    isAuthenticated: !!currentUser,
    authenticationPath: "/auth/sign-in",
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<NavigationLayout />}>
          <Route index element={<Navigate to="/categories" />} />
          <Route
            path="categories"
            element={
              <ProtectedRoute
                {...defaultProtectedRouteProps}
                outlet={<Category />}
              />
            }
          />
          <Route path="auth/sign-in" element={<SignIn />} />
          <Route
            path="categories/add-category"
            element={
              <ProtectedRoute
                {...defaultProtectedRouteProps}
                outlet={<AddCategory />}
              />
            }
          />
          <Route
            path="categories/:id"
            element={
              <ProtectedRoute
                {...defaultProtectedRouteProps}
                outlet={<EditCategory />}
              />
            }
          />
          <Route
            path="categories/:id/products"
            element={
              <ProtectedRoute
                {...defaultProtectedRouteProps}
                outlet={<Product />}
              />
            }
          />
          <Route
            path="customers"
            element={
              <ProtectedRoute
                {...defaultProtectedRouteProps}
                outlet={<Customer />}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <CustomToast />
    </>
  );
};

export default App;
