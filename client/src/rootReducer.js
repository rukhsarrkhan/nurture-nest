import { combineReducers } from 'redux';
import { userReducer } from './redux/users/userReducer';
import { vaccineReducer } from './redux/vaccines/vaccineReducer';
import { appointmentReducer } from './redux/appointments/appointmentReducer';
import { dashboardReducer } from './redux/dashboard/dashboardReducer';
import { mealPlanReducer } from './redux/mealplans/mealPlanReducer';
import { homeReducer } from './redux/home/homeReducer';
import { jobReducer } from './redux/jobs/jobReducer';
import { nannyDetailsReducer } from './redux/nannyDetails/nannyDetailsReducer'


const rootReducer = combineReducers({
    users: userReducer,
    vaccines: vaccineReducer,
    appointments: appointmentReducer,
    jobs: jobReducer,
    dashboard: dashboardReducer,
    meals: mealPlanReducer,
    home: homeReducer,
    nanny: nannyDetailsReducer
});

export default rootReducer;
