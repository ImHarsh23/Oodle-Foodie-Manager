import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import axios from "axios";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Button,
} from "@material-tailwind/react";
import Rating from "../../components/Rating/Rating";
import toast from "react-hot-toast";
import { fetchCart } from "../../Redux/Action/Action";
import { useDispatch } from "react-redux";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        open.includes(id) ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

const RestaurantLayout = () => {
  const dispatch = useDispatch();
  const [restaurantData, setRestaurantData] = useState(null);
  const [open, setOpen] = useState([1]); // Default to opening the first Accordion
  const { name } = useParams();

  const handleOpen = (value) => {
    setOpen((prevOpen) =>
      prevOpen.includes(value)
        ? prevOpen.filter((item) => item !== value)
        : [...prevOpen, value]
    );
  };

  const AddToCart = async (category, foodId) => {
    try {
      const { data } = await axios.post(
        "http://localhost:4444/user/cart/add",
        {
          Restaurant_id: restaurantData._id,
          category,
          foodId,
        },
        { withCredentials: true }
      );
      dispatch(fetchCart());
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    async function getRestaurantDetails() {
      let { data } = await axios.post(
        "http://localhost:4444/restaurant",
        { name },
        { withCredentials: true }
      );
      setRestaurantData(data.restaurant);
      if (data.restaurant.cusines.length > 0) {
        setOpen([1]);
      }
    }
    getRestaurantDetails();
  }, [name]);

  if (!restaurantData) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center my-10 mx-auto bg-white py-10 rounded-3xl sm:w-11/12">
      <div className="w-11/12 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-semibold capitalize mb-2">
            {restaurantData.name}
          </h1>
          <p className="uppercase mb-[2px] text-gray-800">
            {restaurantData.cusineCategories.join().length > 19
              ? restaurantData.cusineCategories.join().slice(0, 17) + "..."
              : restaurantData.cusineCategories.join()}
          </p>
          <p className="uppercase text-gray-600">{restaurantData.address}</p>
        </div>
        <button className="bg-green-800 py-[1px] px-2 rounded-lg flex flex-nowrap gap-1 items-center font-semibold text-lg text-white">
          {restaurantData.rating.toFixed(1)}
          <span className="fa fa-star text-xs" />
        </button>
      </div>
      <div className="max-w-screen-md w-full px-4 my-10">
        {restaurantData.cusines.map((category, index) => (
          <Accordion
            key={category._id}
            open={open.includes(index + 1)}
            icon={<Icon id={index + 1} open={open} />}
          >
            <AccordionHeader onClick={() => handleOpen(index + 1)}>
              {category.category}
            </AccordionHeader>
            <AccordionBody>
              {category.food.map((food) => (
                <div
                  key={food._id}
                  className="relative flex flex-wrap text-gray-700 bg-white shadow-md rounded-2xl w-full sm:px-4 py-2 mb-4"
                >
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900 capitalize">
                        {food.name}
                      </h5>
                      <p className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                        ₹{food.price}
                      </p>
                    </div>
                    <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
                      {food.description.length > 120
                        ? food.description.slice(0, 120) + "..."
                        : food.description}
                    </p>
                  </div>
                  <div className="flex items-start justify-between w-full mt-1 sm:p-2">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 border-2 rounded-lg overflow-hidden bg-blue-gray-600">
                      <img
                        className="max-w-full w-full h-full object-cover"
                        src={food.image[0].url}
                        alt=""
                      />
                    </div>
                    <button
                      onClick={() => AddToCart(category.category, food._id)}
                      className="align-middle select-none font-sans font-bold text-center uppercase transition-all text-xs py-2 px-4 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                      type="button"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </AccordionBody>
          </Accordion>
        ))}
      </div>
      <Rating />
    </div>
  );
};

export default RestaurantLayout;
