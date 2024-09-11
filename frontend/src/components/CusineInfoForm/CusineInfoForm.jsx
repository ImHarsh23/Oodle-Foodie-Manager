import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Chip } from "@material-tailwind/react";
import { Select, Option } from "@material-tailwind/react";
import { cuisines } from "../../utils/constants";

const api = axios.create({
  baseURL: "https://oodle-foodie-manager-com7.vercel.app",
});

const CusineInfoForm = () => {
  const [cusines, setCusines] = useState(null);
  const { name } = useParams();
  const [popUp, setPopUp] = useState(false);
  const [newCategory, setNewCategory] = useState(null);

  const popUpClickHandler = () => {
    setPopUp(!popUp);
  };

  const AddCategoryHandler = async () => {
    try {
      let { data } = await api.post(
        "/restaurant/cuisine-category-add",
        { category: newCategory, restaurant_name: name },
        { withCredentials: true }
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setPopUp(false);
  };

  useEffect(() => {
    const fetchCusines = async () => {
      let { data } = await api.get(`/restaurant/all-cuisines/${name}`, {
        withCredentials: true,
      });
      setCusines(data.data);
    };
    try {
      fetchCusines();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, [popUp]);

  return (
    <>
      <div className="mt-10 relative">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Cusine Information
        </h2>
        <div className="mt-5 flex gap-2 flex-wrap">
          {cusines &&
            cusines.map((item) => (
              <Link
                key={item._id}
                to={`/restaurant/${name}/edit/${item.category}`}
              >
                <Chip value={item.category} variant="outlined" color="blue" />
              </Link>
            ))}
          <div onClick={popUpClickHandler} className="cursor-pointer">
            <Chip
              className="bg-[#FFC933] text-black font-semibold"
              value="Add new category"
            />
          </div>
        </div>
      </div>
      {popUp && (
        <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-screen">
          <div className="relative p-4 w-full max-w-md max-h-full mx-auto mt-44">
            <div className="relative bg-white rounded-lg  shadow-2xl shadow-black">
              <button
                onClick={popUpClickHandler}
                type="button"
                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                <h3 className="mb-5 capitalize text-lg font-normal">
                  Select cusine to add
                </h3>
                <div className="w-72 mx-auto mb-5">
                  <Select label="Select Category" className="">
                    {cuisines.map((item) => (
                      <Option
                        onClick={(e) => {
                          setNewCategory(e.target.innerText);
                        }}
                        key={item}
                      >
                        {item}
                      </Option>
                    ))}
                  </Select>
                </div>
                <button
                  onClick={AddCategoryHandler}
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                >
                  Add
                </button>
                <button
                  onClick={popUpClickHandler}
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CusineInfoForm;
