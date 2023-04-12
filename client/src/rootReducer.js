import { combineReducers } from 'redux';
import { userReducer } from './redux/users/userReducer';
const rootReducer = combineReducers({
    users: userReducer
});

export default rootReducer;