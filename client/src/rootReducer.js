import { combineReducers } from 'redux';
import { userReducer } from './redux/users/userReducer';
import { jobReducer } from './redux/jobs/jobReducer';
const rootReducer = combineReducers({
    users: userReducer,
    jobs: jobReducer
});

export default rootReducer;