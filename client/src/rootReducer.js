import { combineReducers } from 'redux';
import {userReducer} from './redux/users/userReducer';
import  {vaccineReducer}  from './redux/vaccines/vaccineReducer';
import {jobReducer} from './redux/jobs/jobReducer';
const rootReducer = combineReducers({
    users: userReducer,
    vaccines: vaccineReducer,
    jobs: jobReducer,
});

export default rootReducer;