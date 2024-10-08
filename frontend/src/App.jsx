import React, { Suspense, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserData, setLoading } from "./Redux/Action/Action";
import FullPageLoading from "./components/FullPageLoading/FullPageLoading";

const Hero = React.lazy(() => import("./layout/Hero/Hero"));
const Login = React.lazy(() => import("./components/Login/Login"));
const Signup = React.lazy(() => import("./components/SignUp.js/Signup"));
const ForgotLayout = React.lazy(() =>
  import("./layout/ForgotLayout/ForgotLayout")
);
const RestaurantLayout = React.lazy(() =>
  import("./layout/RestaurantLayout/RestaurantLayout")
);
const MyRestaurantLayout = React.lazy(() =>
  import("./layout/MyRestaurantLayout/MyRestaurantLayout")
);
const AddRestaurant = React.lazy(() =>
  import("./layout/AddRestaurant/AddRestaurant")
);
const EditRestaurant = React.lazy(() =>
  import("./layout/EditRestaurant/EditRestaurant")
);
const EditCategory = React.lazy(() =>
  import("./layout/EditCategory/EditCategory")
);
const MyProfileLayout = React.lazy(() =>
  import("./layout/MyProfile/MyProfileLayout")
);
const Search = React.lazy(() => import("./components/Search/Search"));
const Cart = React.lazy(() => import("./components/Cart/Cart"));
const OrderHistoryLayout = React.lazy(() =>
  import("./layout/OrderHistoryLayout/OrderHistoryLayout")
);
const NotFound = React.lazy(() => import("./components/NotFound/NotFound"));

const App = () => {
  const dispatch = useDispatch();
  const { Rloading, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("RefreshToken") || null;
    if (token) {
      dispatch(fetchUserData());
    } else {
      dispatch(setLoading(false));
    }
  }, []);

  if (Rloading) {
    return <FullPageLoading />;
  }

  return (
    <div className="p-[0.1px] min-h-screen bg-gradient-to-l from-white to-indigo-200">
      <Toaster />
      <Suspense fallback={<FullPageLoading />}>
        <Cart />
        <div className="max-w-6xl mx-auto md:flex lg:block">
          <Navbar />
          <Routes>
            <Route path="/" element={<Hero />}>
              <Route path="search" element={<Search />} />
            </Route>
            <Route
              path="/user/login"
              element={isLoggedIn ? <Navigate to={"/"} /> : <Login />}
            />
            <Route
              path="/user/signup"
              element={isLoggedIn ? <Navigate to={"/"} /> : <Signup />}
            />
            <Route
              path="/user/forgot-password"
              element={isLoggedIn ? <Navigate to={"/"} /> : <ForgotLayout />}
            />
            <Route
              path="/restaurant/:name"
              element={
                !isLoggedIn ? <Navigate to={"/"} /> : <RestaurantLayout />
              }
            />
            <Route
              path="/restaurant/add"
              element={!isLoggedIn ? <Navigate to={"/"} /> : <AddRestaurant />}
            />
            <Route
              path="/restaurant/:name/edit"
              element={!isLoggedIn ? <Navigate to={"/"} /> : <EditRestaurant />}
            />
            <Route
              path="/restaurant/:name/edit/:category"
              element={!isLoggedIn ? <Navigate to={"/"} /> : <EditCategory />}
            />
            <Route
              path="/restaurants/user/:id"
              element={
                !isLoggedIn ? <Navigate to={"/"} /> : <MyRestaurantLayout />
              }
            />
            <Route
              path="/profile"
              element={
                !isLoggedIn ? <Navigate to={"/"} /> : <MyProfileLayout />
              }
            />
            <Route
              path="/user/history"
              element={
                !isLoggedIn ? <Navigate to={"/"} /> : <OrderHistoryLayout />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Suspense>
    </div>
  );
};

export default App;
