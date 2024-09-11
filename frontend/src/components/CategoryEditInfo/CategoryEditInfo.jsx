import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import NewFoodForm from "../NewFoodForm/NewFoodForm";
import DeletePopUp from "../DeletePopUp/DeletePopUp";
import UpdateFoodForm from "../UpdateFoodForm/UpdateFoodForm";

const api = axios.create({
  baseURL: "https://oodle-foodie-manager-l366.vercel.app",
});

const CategoryEditInfo = () => {
  const navigate = useNavigate();
  const { name, category } = useParams();
  const [foodList, setFoodList] = useState(null);
  const [popUpDeleteCategory, setpopUpDeleteCategory] = useState(false);
  const [popUpDeleteFood, setpopUpDeleteFood] = useState(false);
  const [popUpNewFood, setpopUpNewFood] = useState(false);
  const [popUpUpdateFood, setpopUpUpdateFood] = useState(false);
  const [updateFoodId, setUpdateFoodId] = useState(null);
  const [deleteFoodId, setDeleteFoodId] = useState(null);

  const fetchFoodList = async () => {
    let { data } = await api.get("/restaurant/food-items", {
      params: {
        restaurant_name: name,
        category: category,
      },
      withCredentials: true,
    });
    return data;
  };

  const closeModal = () => {
    setpopUpDeleteCategory(false);
    setpopUpDeleteFood(false);
  };

  const foodUpdateHandler = async (id) => {
    setpopUpUpdateFood(true);
    setUpdateFoodId(id);
  };

  const handleDeleteCategory = async () => {
    try {
      let response = await api.post(
        "/restaurant/cuisine-category-remove",
        { category, restaurant_name: name },
        { withCredentials: true }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    closeModal();
    navigate(-1);
  };

  const foodDeleteHandler = (id) => {
    setDeleteFoodId(id);
    setpopUpDeleteFood(true);
  };

  const handleDeleteFood = async () => {
    try {
      let response = await api.get(
        `/restaurant/delete-food-item/${deleteFoodId}`,
        {
          params: {
            restaurant_name: name,
            category: category,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    closeModal();
  };

  useEffect(() => {
    try {
      fetchFoodList().then((data) => {
        setFoodList(data.data);
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, [popUpNewFood, popUpDeleteCategory, popUpDeleteFood, popUpUpdateFood]);

  return (
    <div>
      <div className="mb-4 text-lg font-bold text-gray-900 flex justify-between items-center">
        <h2 className=" capitalize text-lg sm:text-2xl">{category} category</h2>
        <Button
          onClick={() => {
            setpopUpDeleteCategory(!popUpDeleteCategory);
          }}
          className="bg-red-300 capitalize text-sm px-3 py-2"
        >
          Delete category
        </Button>
      </div>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr justify-items-center gap-5">
        {foodList &&
          foodList.map((food) => (
            <div
              key={food._id}
              className="w-full max-w-96 sm:max-w-full flex flex-col"
            >
              <div className="rounded-lg bg-white shadow-secondary-1 grow flex flex-col">
                <div
                  className="relative overflow-hidden bg-cover bg-no-repeat"
                  data-twe-ripple-init
                  data-twe-ripple-color="light"
                >
                  <img
                    className="rounded-t-lg"
                    src={food.image[0].url}
                    alt="Bold typography"
                    style={{
                      display: "block",
                      objectFit: "cover",
                      width: "100%",
                      height: 150,
                      backgroundColor: "var(--gray-5)",
                    }}
                  />
                </div>
                <div className="px-1 text-surface h-auto grow flex flex-col">
                  <div className="my-2 text-xl font-medium leading-tight capitalize flex justify-between">
                    <h5>{food.name}</h5>
                    <h5>₹{food.price}</h5>
                  </div>
                  <p className="mb-4">
                    {food.description.length > 70
                      ? food.description.slice(0, 70) + "..."
                      : food.description}
                  </p>
                  <div className="flex gap-4 justify-center mt-auto">
                    <button
                      onClick={() => {
                        foodUpdateHandler(food._id);
                      }}
                      type="button"
                      className="inline-block rounded active:scale-95 px-6 py-2 font-medium leading-normal shadow-lg transition duration-150 ease-in-out bg-[#FFC933]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        foodDeleteHandler(food._id);
                      }}
                      type="button"
                      className="inline-block rounded px-3 py-2 font-medium border-[1px] border-black leading-normal shadow-lg transition hover:text-white duration-150 ease-in-out hover:bg-red-300 "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        <Card className="p-1 w-full max-w-96 sm:max-w-full border-2 border-black">
          <CardBody>
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-2 text-center"
            >
              Add new Food
            </Typography>
          </CardBody>
          <CardFooter className="pt-0 mx-auto">
            <Button
              onClick={() => {
                setpopUpNewFood(true);
              }}
            >
              Click here
            </Button>
          </CardFooter>
        </Card>
      </div>
      {popUpDeleteCategory && (
        <DeletePopUp
          content={"category"}
          closeModal={closeModal}
          handleDelete={handleDeleteCategory}
        />
      )}
      {popUpDeleteFood && (
        <DeletePopUp
          content={"food"}
          closeModal={closeModal}
          handleDelete={handleDeleteFood}
        />
      )}
      {popUpUpdateFood && (
        <UpdateFoodForm
          popUpUpdateFood={popUpUpdateFood}
          setpopUpUpdateFood={setpopUpUpdateFood}
          id={updateFoodId}
        />
      )}

      {popUpNewFood && <NewFoodForm setpopUpNewFood={setpopUpNewFood} />}
    </div>
  );
};

export default CategoryEditInfo;
