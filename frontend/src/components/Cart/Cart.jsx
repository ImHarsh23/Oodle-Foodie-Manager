import axios from "axios";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, setIsCartOpen } from "../../Redux/Action/Action";
import { useEffect } from "react";

const api = axios.create({
  baseURL: "https://oodle.onrender.com",
});

const Cart = () => {
  const dispatch = useDispatch();
  const { isCartOpen, cartDetail, isLoggedIn } = useSelector(
    (state) => state.auth
  );

  const handleClose = () => {
    dispatch(setIsCartOpen(false));
  };

  const handleRemoveItem = async (item) => {
    try {
      let { data } = await api.get(`/user/cart/remove/${item._id}`, {
        withCredentials: true,
      });
      if (isLoggedIn) dispatch(fetchCart());
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const orderPlace = async (e) => {
    if (!isLoggedIn) {
      return toast.error("You need to Login");
    }
    const toastId = toast.loading("processing order");
    e.preventDefault();
    try {
      let { data } = await api.get("/user/cart/order/place", {
        withCredentials: true,
      });
      dispatch(fetchCart());
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error.response.data.message, { id: toastId });
    }
  };

  const subTotal = () => {
    let price = 0;
    cartDetail.forEach((item) => {
      price += +item.food.price * +item.quantity;
    });
    return price;
  };

  useEffect(() => {
    if (isLoggedIn) dispatch(fetchCart());
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div
      className="relative z-[52]"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md">
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2
                      className="text-lg font-medium text-gray-900"
                      id="slide-over-title"
                    >
                      Shopping cart
                    </h2>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                      >
                        <span className="absolute -inset-0.5"></span>
                        <span className="sr-only">Close panel</span>
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      <ul
                        role="list"
                        className="-my-6 divide-y divide-gray-200"
                      >
                        {cartDetail &&
                          cartDetail.map((item) => (
                            <li key={item._id} className="flex py-6">
                              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img
                                  src={item.food.image[0].url}
                                  alt={item.food.name}
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>
                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3 className=" capitalize">
                                      {item.food.name}
                                    </h3>
                                    <p className="ml-4">₹{item.food.price}</p>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {item.food.description.slice(0, 80) + "..."}
                                  </p>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                  <p className="text-gray-500">
                                    Qty {item.quantity}
                                  </p>
                                  <div className="flex">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveItem(item)}
                                      className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>₹{cartDetail ? subTotal() : 0}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="mt-6">
                    <a
                      onClick={orderPlace}
                      href="#"
                      className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                      Checkout
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
