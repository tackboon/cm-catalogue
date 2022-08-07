import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";

import { onAuthStateChangedListener } from "./utils/firebase/firebase.utils";
import { setCurrentSession } from "./store/user/user.action";
import { selectCurrentUser } from "./store/user/user.selector";
import ProtectedRoute, { ProtectedRouteProps } from "./route/guard";
import NavigationLayout from "./layout/navigation-layout/navigation_layout.component";
import Home from "./pages/home/home.component";
import SignIn from "./pages/sign-in/sign_in.component";
import Category from "./pages/category/category.component";
import Customer from "./pages/customer/customer.component";

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
  }, []);

  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, "outlet"> = {
    isAuthenticated: !!currentUser,
    authenticationPath: "/auth/sign-in",
  };

  return (
    <Routes>
      <Route path="/" element={<NavigationLayout />}>
        <Route index element={<Home />} />
        <Route path="auth/sign-in" element={<SignIn />} />
        <Route
          path="category"
          element={
            <ProtectedRoute
              {...defaultProtectedRouteProps}
              outlet={<Category />}
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
      </Route>
    </Routes>
  );
};

export default App;
