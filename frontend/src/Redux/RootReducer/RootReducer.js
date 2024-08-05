import { combineReducers } from 'redux';
import counterReducer from "../Reducer/CounterReducer";

const rootReducer = combineReducers({
    auth: counterReducer
})

export default rootReducer;