import { combineReducers } from 'redux';
import userReducer from './redux/users/userReducer';
import  vaccineReducer  from './redux/vaccines/vaccineReducer';
const rootReducer = combineReducers({
    users: userReducer,
    vaccines: vaccineReducer
});

export default rootReducer;