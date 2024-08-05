import React, { Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserData, setLoading } from "./Redux/Action/Action";
import { useCookies } from "react-cookie";
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
  const { Rloading } = useSelector((state) => state.auth);
  const [cookies] = useCookies();

  useEffect(() => {
    const token = cookies.RefreshToken;

    if (token) {
      dispatch(fetchUserData());
    } else {
      dispatch(setLoading(false));
    }
  }, [cookies.RefreshToken]);

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
          {/* <StickyNavbar /> */}
          <Routes>
            <Route path="/" element={<Hero />}>
              <Route path="search" element={<Search />} />
            </Route>
            <Route path="/user/login" element={<Login />} />
            <Route path="/user/signup" element={<Signup />} />
            <Route path="/user/forgot-password" element={<ForgotLayout />} />
            <Route path="/restaurant/:name" element={<RestaurantLayout />} />
            <Route path="/restaurant/add" element={<AddRestaurant />} />
            <Route path="/restaurant/:name/edit" element={<EditRestaurant />} />
            <Route
              path="/restaurant/:name/edit/:category"
              element={<EditCategory />}
            />
            <Route
              path="/restaurants/user/:id"
              element={<MyRestaurantLayout />}
            />
            <Route path="/profile" element={<MyProfileLayout />} />
            <Route path="/user/history" element={<OrderHistoryLayout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Suspense>
    </div>
  );
};

export default App;
