import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import isoToReadableDate from "../../utils/isoToReadableDate";
import { useSelector, useDispatch } from "react-redux";
import { setIsCartOpen } from "../../Redux/Action/Action";

const api = axios.create({
  baseURL: "https://oodle.onrender.com",
});

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { cartDetail } = useSelector((state) => state.auth);
  const [history, setHistory] = useState(null);

  const subtotal = (items) => {
    let subtotalPrice = 0;
    items.forEach((food) => {
      subtotalPrice += +food.food.price * +food.quantity;
    });
    return subtotalPrice;
  };

  const BuyAgain = async (items) => {
    try {
      let { data } = await api.post(
        `/user/ordersHistory/buy`,
        { items },
        {
          withCredentials: true,
        }
      );
      dispatch(setIsCartOpen(true));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      let { data } = await api.get(`/user/ordersHistory`, {
        withCredentials: true,
      });
      setHistory(data.history);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, [cartDetail]);

  return (
    <section className="py-8 relative bg-white rounded-3xl my-6 md:my-10 w-full">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="font-manrope font-extrabold text-lg md:text-xl lg:text-2xl leading-7 md:leading-8 lg:leading-10 text-black mb-6 md:mb-9">
          Order History
        </h2>
        {!history ? (
          <div className="flex justify-center">
            <Loading />
          </div>
        ) : (
          <div>
            {history.map((element) => (
              <div
                key={element._id}
                className="mt-6 md:mt-7 border-2 border-gray-600 rounded-3xl pt-1"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-3 md:px-11">
                  <div>
                    <p className="font-medium text-sm sm:text-base lg:text-lg leading-6 md:leading-7 lg:leading-8 text-black whitespace-nowrap">
                      Order Id : #{element._id}
                    </p>
                    <p className="font-medium text-sm sm:text-base lg:text-lg leading-6 md:leading-7 lg:leading-8 text-black mt-2">
                      Order Date : {isoToReadableDate(element.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => {
                        BuyAgain(element);
                      }}
                      className="rounded-full px-6 py-2 md:px-7 md:py-3 bg-indigo-600 shadow-sm text-white font-semibold text-sm transition-all duration-500 hover:shadow-indigo-400 hover:bg-indigo-700"
                    >
                      Repeat Order
                    </button>
                  </div>
                </div>
                <hr className="h-[1.5px] bg-blue-gray-100 my-2" />
                {element.item.map((food) => (
                  <div key={food._id}>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 px-3">
                      <div className="grid grid-cols-1 md:grid-cols-4 w-full gap-6 ">
                        <div className="col-span-1 flex justify-center items-center">
                          <img
                            src={food.food.image[0].url}
                            alt="Product Image"
                            className="w-full max-w-[150px] object-cover my-auto"
                          />
                        </div>
                        <div className="col-span-3 flex flex-col justify-center text-center md:text-left">
                          <h6 className=" capitalize font-manrope font-semibold text-lg leading-7 md:leading-8 lg:leading-9 text-black mb-2">
                            {food.food.name}
                          </h6>
                          <p className="font-normal text-base leading-6 md:leading-7 lg:leading-8 text-gray-500 mb-6">
                            Category: {food.category}
                          </p>
                          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
                            <span className="font-normal text-base leading-6 md:leading-7 lg:leading-8 text-gray-500">
                              Qty: {food.quantity}
                            </span>
                            <p className="font-semibold text-lg leading-6 md:leading-7 lg:leading-8 text-black">
                              Price ₹{food.food.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className="h-[1.5px] bg-blue-gray-100 my-2" />
                  </div>
                ))}

                <div className="px-3 md:px-11 flex flex-col md:flex-row items-center justify-between">
                  <div></div>
                  <p className="font-medium text-lg md:text-xl leading-6 md:leading-7 lg:leading-8 text-black py-4">
                    <span className="text-gray-500">Total Price: </span> &nbsp;₹
                    {subtotal(element.item)}.00
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderHistory;
