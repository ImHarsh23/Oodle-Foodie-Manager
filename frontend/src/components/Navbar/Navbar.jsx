import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  SearchIcon,
  OfferIcon,
  CartIcon,
  LoginIcon,
} from "../../utils/icons";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, fetchCart, setIsCartOpen } from "../../Redux/Action/Action";
import { alternateProfileImage, logo } from "../../utils/constants";

const Navbar = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, auth, cartCount } = useSelector((state) => state.auth);
  const [openNav, setOpenNav] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const navigate = useNavigate();

  const logoutClickHandler = async (e) => {
    e.preventDefault();
    setIsProfile(false);
    dispatch(logout());
    navigate("/");
  };

  function scrollToTop() {
    var timerHandle = setInterval(function () {
      if (
        document.body.scrollTop != 0 ||
        document.documentElement.scrollTop != 0
      )
        window.scrollBy(0, -40);
      else clearInterval(timerHandle);
    }, 5);
  }

  const turnOpenNavOff = () => {
    if (openNav) setOpenNav(false);
  };

  useEffect(() => {
    if (isLoggedIn) dispatch(fetchCart());
    window.addEventListener("resize", turnOpenNavOff);
    window.removeEventListener("resize", turnOpenNavOff);
  }, []);

  return (
    <div className="bg-[#0A1D56] p-2 lg:px-4 flex justify-between md:justify-start lg:justify-between items-center md:place-items-end lg:items-center md:flex-col lg:flex-row md:max-h-screen sticky top-0 z-[51] md:gap-10 md:h-screen lg:h-auto lg:rounded-full lg:mt-3">
      <Link to={"/"}>
        <div id="left-nav" className="w-24 md:w-32 overflow-hidden">
          <img src={logo} alt="Logo" className="" />
        </div>
      </Link>
      <i
        onClick={() => {
          setOpenNav(!openNav);
        }}
        className={`fa ${
          !openNav ? "fa-bars" : "fa-times"
        } text-white text-3xl md:hidden ml-auto mr-5`}
        aria-hidden="true"
      />
      <div className=" md:mx-auto lg:mx-0 lg:flex" id="right-nav">
        <div
          className={`${
            openNav
              ? "absolute z-[52] top-[55px] opacity-100 visible "
              : "opacity-0 invisible -top-64"
          } absolute transition-all md:transition-none duration-700 md:static md:opacity-100 md:visible flex gap-y-4 py-5 md:py-0 md:gap-8 text-white items-center flex-col lg:flex-row sm:mb-8 lg:mb-0 lg:mr-12 left-0 right-0 bg-[#0A1D56] rounded-b-full`}
        >
          <Link
            onClick={() => {
              turnOpenNavOff();
            }}
            to={"/"}
            className="flex items-center flex-nowrap relative p-1"
          >
            <HomeIcon />
            <span>Home</span>
          </Link>
          <NavLink
            to={"/search"}
            onClick={() => {
              turnOpenNavOff();
              scrollToTop();
            }}
            className={`flex items-center flex-nowrap relative p-1`}
          >
            <SearchIcon />
            <span>Search</span>
          </NavLink>
          <Link
            to={"/offers"}
            onClick={() => {
              turnOpenNavOff();
            }}
            className={`flex items-center flex-nowrap relative p-1`}
          >
            <OfferIcon />
            <span>Offers</span>
          </Link>
          <div
            onClick={() => {
              dispatch(setIsCartOpen(true));
              turnOpenNavOff();
            }}
            className={`flex items-center flex-nowrap p-2 relative cursor-pointer`}
          >
            <div>
              <CartIcon />
              <div className="absolute text-black top-0 -right-3.5 text-sm font-medium rounded-full px-2 bg-blue-50 z-2">
                {cartCount && cartCount}
              </div>
            </div>
            <span>Cart</span>
          </div>
        </div>
        {isLoggedIn ? (
          <div className="relative flex justify-center">
            <div
              onClick={() => setIsProfile(!isProfile)}
              className="h-11 w-11 bg-white rounded-full cursor-pointer overflow-hidden"
            >
              <img
                src={auth?.avatar || alternateProfileImage}
                alt="profile image"
              />
            </div>
            <div
              className={`absolute z-[52] right-full md:left-full lg:left-auto w-52 px-5 py-5 bg-white shadow-2xl text-black rounded-lg transition-all duration-500 ${
                isProfile
                  ? "opacity-100 visible top-10"
                  : "opacity-0 invisible top-14"
              }`}
            >
              <ul>
                <li className="list-none px-4 py-2">
                  <Link
                    onClick={() => {
                      setIsProfile(false);
                    }}
                    to={"/profile"}
                  >
                    Profile
                  </Link>
                </li>
                <li className="list-none px-4 py-2 border-t-[1px] border-gray-200">
                  <Link
                    onClick={() => {
                      setIsProfile(false);
                    }}
                    to={`/restaurants/user/${auth._id}`}
                  >
                    My Restaurants
                  </Link>
                </li>
                <li className="list-none px-4 py-2 border-t-[1px] border-gray-200">
                  <Link
                    onClick={() => {
                      setIsProfile(false);
                    }}
                    to={"/user/history"}
                  >
                    Order History
                  </Link>
                </li>
                <li className="list-none px-4 py-2 border-t-[1px] border-gray-200">
                  <p className="cursor-pointer" onClick={logoutClickHandler}>
                    Logout
                  </p>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <Link
            to={"/user/login"}
            className="text-center flex items-center flex-nowrap text-black bg-white rounded-full px-2 py-1"
          >
            <LoginIcon />
            <span className="font-bold">Login</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
