import { combineReducers } from 'redux';
import { userReducer } from './redux/users/userReducer';
const rootReducer = combineReducers({
     users: userReducer,
    vaccines: vaccineReducer,
    jobs: jobReducer,
    appointments: appointmentReducer,
    dashboard: dashboardReducer
});

export default rootReducer;
