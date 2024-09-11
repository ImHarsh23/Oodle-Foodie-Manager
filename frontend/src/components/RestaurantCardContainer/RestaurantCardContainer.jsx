import { useEffect, useState } from "react";
import RestaurantCard from "../RestaurantCard/RestaurantCard";
import CardSkeleton from "../CardSkeleton/CardSkeleton";
import axios from "axios";
import toast from "react-hot-toast";
import useDebounce from "../../customHooks/useDebounce";

const api = axios.create({
  baseURL: "https://oodle-foodie-manager-l366.vercel.app",
});

const RestaurantCardContainer = ({ setCallback }) => {
  const [restaurantsList, setRestaurantsList] = useState(null);
  const searchDebounce = useDebounce();

  function getLocalStorageWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null; // If no item found, return null

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key); // Remove expired item
      return null;
    }

    return item.value; // Return the valid data
  }

  function setLocalStorageWithExpiry(key, value, ttl) {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl, // Expiry time in milliseconds
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  async function fetchData() {
    let response = await api.get("/list/restaurants");
    return response.data;
  }

  const callbackForKeyword = (key) => {
    let debouncer = searchDebounce(searchReastaurantList, 1000);
    debouncer(key);
  };

  const searchReastaurantList = async (key) => {
    try {
      const { data } = await api.get(`/list/search`, {
        params: {
          keyword: key,
        },
        withCredentials: true,
      });
      setRestaurantsList(data.restaurants);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    setCallback(() => callbackForKeyword);
    const data = getLocalStorageWithExpiry("restaurantsList");
    if (data) {
      setRestaurantsList(data);
    } else {
      try {
        fetchData().then(({ restaurantsList }) => {
          setLocalStorageWithExpiry("restaurantsList", restaurantsList, 20000);
          setRestaurantsList(restaurantsList);
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  return (
    <>
      <div className="my-12 min-h-screen">
        <div className="text-center mb-10 text-orange-900 font-bold text-2xl sm:text-3xl lg:text-4xl">
          Explore Restaurants
        </div>
        {restaurantsList ? (
          <div
            className={`${
              restaurantsList.length &&
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr justify-items-center"
            }`}
          >
            {restaurantsList.length ? (
              restaurantsList.map((restaurant) => (
                <RestaurantCard
                  key={restaurant._id}
                  name={restaurant.name}
                  image={restaurant.coverImage}
                  categorys={restaurant.cusineCategories}
                  description={restaurant.description}
                  id={restaurant._id}
                />
              ))
            ) : (
              <div className="text-4xl text-center font-bold">Not Found</div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr justify-items-center">
            {[...Array(9)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default RestaurantCardContainer;
