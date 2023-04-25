import { combineReducers } from 'redux';
import { userReducer } from './redux/users/userReducer';
import { vaccineReducer } from './redux/vaccines/vaccineReducer'
import { jobReducer } from './redux/jobs/jobReducer'
import {appointmentReducer} from './redux/appointments/appointmentReducer'
import {dashboardReducer} from './redux/dashboard/dashboardReducer'
import { mealPlanReducer } from './redux/mealplans/mealPlanReducer';

const rootReducer = combineReducers({
    users: userReducer,
    vaccines: vaccineReducer,
    jobs: jobReducer,
    appointments: appointmentReducer,
    dashboard: dashboardReducer,
    meals: mealPlanReducer
});

export default rootReducer;
