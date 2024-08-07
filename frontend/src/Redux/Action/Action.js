import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
    baseURL: 'https://oodle.onrender.com'
});

// Action Types
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';
export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';
export const FETCH_CART_REQUEST = 'FETCH_CART_REQUEST';
export const FETCH_CART_SUCCESS = 'FETCH_CART_SUCCESS';
export const FETCH_CART_FAILURE = 'FETCH_CART_FAILURE';
export const CART_OPEN = 'CART_OPEN';
export const LOADING = "LOADING"

export const login = (formInfo) => async (dispatch) => {
    const toastId = toast.loading("Please wait logging in");
    dispatch({ type: LOGIN_REQUEST });
    try {
        const { data } = await api.post(
            "/user/login",
            formInfo,
            { withCredentials: true }
        );
        toast.success(data.message, { id: toastId });
        localStorage.setItem("RefreshToken", data.refreshToken);
        dispatch({ type: LOGIN_SUCCESS, payload: data.user });
    } catch (error) {
        toast.error(error?.response?.data?.message, { id: toastId });
        dispatch({ type: LOGIN_FAILURE, payload: error.response?.data?.message || 'Login failed' });
    }
};

export const logout = () => async (dispatch) => {
    try {
        const { data } = await api.get(
            "/user/logout",
            { withCredentials: true }
        );
        toast.success(data.message);
    } catch (error) {
        toast.error("Something Went Wrong");
    }
    localStorage.removeItem("RefreshToken");
    dispatch({ type: LOGOUT });
};

export const fetchUserData = () => async (dispatch) => {
    dispatch({ type: FETCH_USER_REQUEST });
    try {
        const { data } = await api.post("/user/me", {}, { withCredentials: true });
        dispatch({ type: FETCH_USER_SUCCESS, payload: data.user });
    } catch (error) {
        toast.error(error.response.data.message);
        dispatch({ type: FETCH_USER_FAILURE });
    }
};

export const fetchCart = () => async (dispatch) => {
    try {
        const { data } = await api.get("/user/cart", { withCredentials: true });
        dispatch({ type: FETCH_CART_SUCCESS, payload: data.cart });
    } catch (error) {
        toast.error(error.response.data.message);
    }
};

export const setIsCartOpen = (boolVal) => (dispatch) => {
    dispatch({ type: CART_OPEN, payload: boolVal });
};

export const setLoading = (boolVal) => (dispatch) => {
    dispatch({ type: LOADING, payload: boolVal });
};