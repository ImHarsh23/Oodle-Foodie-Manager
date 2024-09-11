import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import toast from "react-hot-toast";
import MyRestaurantCard from "../../components/MyRestaurantCard/MyRestaurantCard";
import { Button } from "@material-tailwind/react";

const api = axios.create({
  baseURL: "https://oodle-foodie-manager-com7.vercel.app",
});

const MyRestaurantLayout = () => {
  const [restaurants, setRestaurants] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popUp, setPopUp] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { id } = useParams();

  const closeModal = () => {
    setPopUp(!popUp);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    const toastId = toast.loading("Processing request");
    try {
      let { data } = await api.get(`/restaurant/delete/${deleteId}`, {
        withCredentials: true,
      });
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error.response.data.message, { id: toastId });
    }
    closeModal();
  };

  const restaurantsList = async () => {
    let { data } = await api.get(`/restaurant/user/${id}`, {
      withCredentials: true,
    });
    return data;
  };

  useEffect(() => {
    restaurantsList()
      .then((data) => {
        setRestaurants(data.restaurants);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [popUp]);

  if (loading) {
    return (
      <div className="w-min mx-auto mt-20">
        <Loading />
      </div>
    );
  }

  if (!restaurants) {
    return (
      <div className="h-screen text-center w-full text-4xl mt-20">
        Something Went Wrong
      </div>
    );
  }

  return (
    <div>
      <div className="py-3 px-1 flex justify-end items-center relative">
        <h3 className="text-xl sm:text-3xl text-light-blue-900 font-semibold absolute left-0 md:left-1/2 md:-translate-x-1/2">
          My Restaurants
        </h3>
        <Link to={"/restaurant/add"}>
          <Button size="sm" color="green">
            Add Restaurant +
          </Button>
        </Link>
      </div>

      {restaurants.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr justify-items-center gap-5 my-5 w-11/12 mx-auto">
          {restaurants.map((restaurant) => (
            <MyRestaurantCard
              key={restaurant._id}
              id={restaurant._id}
              name={restaurant.name}
              description={restaurant.description}
              popUp={popUp}
              setPopUp={setPopUp}
              setDeleteId={setDeleteId}
            />
          ))}
        </div>
      ) : (
        <p className="text-center mt-20">You haven't add any restaurant yet</p>
      )}

      <div
        className={` ${
          popUp ? "opacity-100 visible" : "opacity-0 invisible"
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full transition-all duration-500`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={closeModal}
              data-modal-hide="popup-modal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
              <svg
                className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this category?
              </h3>
              <button
                onClick={() => {
                  handleDelete();
                }}
                type="button"
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              >
                Yes, I'm sure
              </button>
              <button
                onClick={closeModal}
                type="button"
                className="py-2.5 px-5 ml-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRestaurantLayout;
