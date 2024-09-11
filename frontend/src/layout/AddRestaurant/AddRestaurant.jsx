import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { indianStates } from "../../utils/constants";

const api = axios.create({
  baseURL: "https://oodle-foodie-manager-com7.vercel.app",
});

const AddRestaurant = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "",
    contact: "",
    description: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleFileUpload = (ev) => {
    setSelectedFile(ev.target.files[0]);
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Submitting form...");
    try {
      let response = await api.post(
        "/restaurant/add",
        {
          name: restaurantInfo.name,
          contact: restaurantInfo.contact,
          description: restaurantInfo.description,
          address: `${restaurantInfo.city}, ${restaurantInfo.state} - ${restaurantInfo.zip}`,
          image: selectedFile,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message, { id: toastId });
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message, { id: toastId });
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 my-10 rounded-3xl sm:w-11/12 px-7 mx-auto">
      <form className="max-w-4xl mx-auto mt-10" onSubmit={formSubmitHandler}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Restaurant Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="grid-first-name"
              type="text"
              placeholder="Jane"
              onChange={(e) => {
                setRestaurantInfo({ ...restaurantInfo, name: e.target.value });
              }}
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-last-name"
            >
              Mobile Number
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-last-name"
              type="text"
              placeholder="Doe"
              onChange={(e) => {
                setRestaurantInfo({
                  ...restaurantInfo,
                  contact: e.target.value,
                });
              }}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Description
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-password"
              type="text"
              placeholder="We have greate cusine for ..."
              onChange={(e) => {
                setRestaurantInfo({
                  ...restaurantInfo,
                  description: e.target.value,
                });
              }}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-8">
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              City
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-city"
              type="text"
              placeholder="Albuquerque"
              onChange={(e) => {
                setRestaurantInfo({ ...restaurantInfo, city: e.target.value });
              }}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-state"
            >
              State
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-state"
                onChange={(e) => {
                  setRestaurantInfo({
                    ...restaurantInfo,
                    state: e.target.value,
                  });
                }}
              >
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-zip"
            >
              Zip
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-zip"
              type="text"
              placeholder="90210"
              onChange={(e) => {
                setRestaurantInfo({ ...restaurantInfo, zip: e.target.value });
              }}
            />
          </div>
        </div>
        <div className="w-full md:w-1/3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="file_input"
          >
            Upload file
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            onChange={handleFileUpload}
          />
          <p className="mt-1 text-sm text-white " id="file_input_help">
            SVG, PNG, JPG.
          </p>
        </div>
        <div className="flex justify-end gap-4">
          <Button
            onClick={() => {
              navigate(-1);
            }}
            color="red"
          >
            Cancel
          </Button>
          <Button type="submit">Add Restaurant</Button>
        </div>
      </form>
    </div>
  );
};

export default AddRestaurant;
