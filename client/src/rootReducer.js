import { combineReducers } from 'redux';
import {userReducer} from './redux/users/userReducer';
import  {vaccineReducer}  from './redux/vaccines/vaccineReducer';
import {appointmentReducer} from './redux/appointments/appointmentReducer';


const rootReducer = combineReducers({
    users: userReducer,
    vaccines: vaccineReducer,
    appointments: appointmentReducer
});

export default rootReducer;
