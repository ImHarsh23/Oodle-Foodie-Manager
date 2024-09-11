import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../Loading/Loading";
import { Button } from "@material-tailwind/react";
import { useRef } from "react";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "https://oodle-foodie-manager-l366.vercel.app/",
});

const GeneralInfoForm = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const [restaurantData, setRestaurantData] = useState(null);
  const refe = useRef();

  useEffect(() => {
    async function getRestaurantDetails() {
      let { data } = await api.post(
        "/restaurant",
        { name },
        { withCredentials: true }
      );
      setRestaurantData(data.restaurant);
    }
    getRestaurantDetails();
  }, []);

  const loadFile = function (event) {
    refe.current.src = URL.createObjectURL(event.target.files[0]);
    setRestaurantData({ ...restaurantData, image: event.target.files[0] });
  };

  const revokeImage = function () {
    URL.revokeObjectURL(refe.current.src); // free memory
  };

  const submitHandler = async (e) => {
    const toastId = toast.loading("Updating details");
    e.preventDefault();
    try {
      let { data } = await api.post(
        "/restaurant/restaurant-update",
        restaurantData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error.response.data.message, { id: toastId });
    }
  };

  if (!restaurantData) {
    return (
      <div className="h-screen w-screen absolute flex justify-center items-center">
        <Loading>Fetching Data...</Loading>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        General Information
      </h2>
      <form onSubmit={submitHandler}>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="sm:col-span-2">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Restaurant Name
            </label>
            <input
              disabled
              type="text"
              name="name"
              id="name"
              className="uppercase bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Type product name"
              value={restaurantData.name}
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="brand"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Address
            </label>
            <input
              type="text"
              name="brand"
              id="brand"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Product brand"
              value={restaurantData.address}
              onChange={(e) => {
                setRestaurantData({
                  ...restaurantData,
                  address: e.target.value,
                });
              }}
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="price"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Contact
            </label>
            <input
              type="number"
              name="price"
              id="price"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="9999222211"
              value={restaurantData.contact}
              onChange={(e) => {
                setRestaurantData({
                  ...restaurantData,
                  contact: e.target.value,
                });
              }}
            />
          </div>

          <div>
            <label
              htmlFor="item-weight"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              disabled
              type="text"
              name="item-weight"
              id="item-weight"
              className="bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              value={restaurantData.email}
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={1}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Your description here"
              value={restaurantData.description}
              onChange={(e) => {
                setRestaurantData({
                  ...restaurantData,
                  description: e.target.value,
                });
              }}
            ></textarea>
          </div>
        </div>
        {/* CoverImage Start */}
        <div className=" mt-8">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Cover image
          </label>
          <div className="flex items-center space-x-6">
            <div className="shrink-0">
              <img
                onLoad={revokeImage}
                ref={refe}
                className="h-32 w-32 object-cover rounded-md"
                src={restaurantData.coverImage}
                alt="Current profile photo"
              />
            </div>
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input
                type="file"
                onChange={loadFile}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700
        hover:file:bg-violet-100"
              />
            </label>
          </div>
        </div>

        <div className="flex gap-4 justify-end my-5">
          <Button
            onClick={() => {
              navigate(-1);
            }}
            className="px-5 text-sm font-medium text-center border-2 shadow-none text-black hover:text-white bg-transparent rounded-lg focus:ring-4 focus:ring-primary-200  hover:bg-red-500"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-5 text-sm font-medium text-white bg-blue-900 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
          >
            Update
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GeneralInfoForm;
