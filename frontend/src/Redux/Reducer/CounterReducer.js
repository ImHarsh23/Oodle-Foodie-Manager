import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    FETCH_USER_REQUEST,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
    FETCH_CART_SUCCESS,
    CART_OPEN,
    LOADING
} from '../Action/Action';

const initialState = {
    isLoggedIn: false,
    auth: null,
    cartDetail: null,
    cartCount: null,
    isCartOpen: false,
    Rloading: true,
    error: null
};

const counterReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
        case FETCH_USER_REQUEST:
            return { ...state, error: null };
        case LOGIN_SUCCESS:
            return { ...state, isLoggedIn: true, auth: action.payload, cartDetail: action.payload.cart, cartCount: action.payload.cart.length, Rloading: false };
        case LOGIN_FAILURE:
        case FETCH_USER_FAILURE:
            return { ...state, Rloading: false, isLoggedIn: false, auth: null };
        case LOGOUT:
            return { ...state, isLoggedIn: false, auth: null, cartDetail: null, cartCount: null };
        case FETCH_USER_SUCCESS:
            return { ...state, auth: action.payload, Rloading: false, isLoggedIn: true };
        case FETCH_CART_SUCCESS:
            return { ...state, cartDetail: action.payload, cartCount: action.payload.length };
        case CART_OPEN:
            return { ...state, isCartOpen: action.payload };
        case LOADING:
            return { ...state, Rloading: action.payload, auth: null, isLoggedIn: false, cartDetail: null, cartCount: null };
        default:
            return state;
    }
};

export default counterReducer;
