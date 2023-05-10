import { GET_DASHBOARD_SUCCESS, GET_DASHBOARD_FAILURE, SET_DASHBOARD_SUCCESS, SET_DASHBOARD_FAILURE } from "./dashboardActionTypes";
import axios from "axios";

export const getDashboardSuccess = (child) => {
    return {
        type: GET_DASHBOARD_SUCCESS,
        payload: child,
    };
};

export const getDashboardFailure = (error) => {
    return {
        type: GET_DASHBOARD_FAILURE,
        payload: error,
    };
};

export const dashboardSetSuccess = (child) => {
    return {
        type: SET_DASHBOARD_SUCCESS,
        payload: child,
    };
};

export const dashboardSetFailure = (error) => {
    return {
        type: SET_DASHBOARD_FAILURE,
        payload: error,
    };
};

export const getDashboardAPICall = (childId) => {
    // THIS NEEDS TO BE REFACTORED

    return async (dispatch) => {
        try {
            let resp = await axios.get(`http://localhost:3000/child/${childId}`);

            let newObj = {
                _id: resp?.data?._id,
                name: resp?.data?.name,
                age: resp?.data?.age,
                sex: resp?.data?.sex,
                jobId: resp.data.jobId,
                mealRequirements: resp?.data?.mealRequirements,
                vaccine: resp?.data?.vaccine,
                nannyId: null,
                appointments: resp?.data?.appointments,
                photoUrl: resp?.data?.photoUrl,
                nannyPhotoUrl: null,
            };

            let resp2 = null;
            let nannyId = null;
            let resp3 = null;

            if (resp.data.jobId) {
                resp2 = await axios.get(`http://localhost:3000/job/findjob/${childId}`);
                nannyId = resp2?.data?.nannyId;
                resp3 = await axios.get(`http://localhost:3000/users/` + nannyId);
            }

            // if (resp?.data?.jobId) {
            //   newObj.jobId = resp.data.jobId;
            // }

            if (resp2?.data?.nannyId) {
                newObj.nannyId = resp2.data.nannyId;
            }

            if (resp2?.data?.nannyId && resp3?.data?.photoUrl) {
                newObj.nannyPhotoUrl = resp3.data.photoUrl;
            }

            dispatch(getDashboardSuccess(newObj));
        } catch (error) {
            dispatch(getDashboardFailure(error));
        }
    };
};
