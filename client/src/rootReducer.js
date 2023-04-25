import { combineReducers } from 'redux';
import {userReducer} from './redux/users/userReducer';
import  {vaccineReducer}  from './redux/vaccines/vaccineReducer';
import {jobReducer} from './redux/jobs/jobReducer';
import {appointmentReducer} from './redux/appointments/appointmentReducer';


const rootReducer = combineReducers({
    users: userReducer,
    vaccines: vaccineReducer,
    jobs: jobReducer,
    appointments: appointmentReducer
});

export default rootReducer;
