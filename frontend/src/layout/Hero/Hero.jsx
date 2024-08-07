import { lazy, Suspense, useState } from "react";
import CustomCarousel from "../../components/Carousel/Carousel";
import Loading from "../../components/Loading/Loading";
import { Outlet, useLocation } from "react-router-dom";

const RestaurantCardContainer = lazy(() =>
  import("../../components/RestaurantCardContainer/RestaurantCardContainer")
);

const Hero = () => {
  const { pathname } = useLocation();
  const [callback, setCallback] = useState(null);
  return (
    <div className="md:px-5 py-5 my-10 bg-white rounded-3xl w-full">
      {pathname.split("/").pop() === "search" ? null : <CustomCarousel />}
      <Outlet context={[callback]} />
      <Suspense
        fallback={
          <div className="flex justify-center mt-5">
            <Loading />
          </div>
        }
      >
        <RestaurantCardContainer setCallback={setCallback} />
      </Suspense>
    </div>
  );
};

export default Hero;
