import { combineReducers } from 'redux';
import {userReducer} from './redux/users/userReducer';
import  {vaccineReducer}  from './redux/vaccines/vaccineReducer';
import {appointmentReducer} from './redux/appointments/appointmentReducer';
import {dashboardReducer} from './redux/dashboard/dashboardReducer';
import { mealPlanReducer } from './redux/mealplans/mealPlanReducer'
import { dashboardLandingReducer } from './redux/dashboardLanding/dashboardLandingReducer';
import { jobReducer } from './redux/jobs/jobReducer';


const rootReducer = combineReducers({
    users: userReducer,
    vaccines: vaccineReducer,
    appointments: appointmentReducer,
    jobs: jobReducer,
    dashboard: dashboardReducer,
    meals: mealPlanReducer,
    dashboardLanding: dashboardLandingReducer
});

export default rootReducer;
