import {
    GET_DASHBOARD_SUCCESS,
    GET_DASHBOARD_FAILURE,
    SET_DASHBOARD_SUCCESS,
    SET_DASHBOARD_FAILURE
} from './dashboardActionTypes'
import axios from 'axios'

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
    console.log(childId,"nannyId in a ction call")
    return async (dispatch) => {
      try {
        let resp = await axios.get(`http://localhost:3000/child/${childId}`);
        console.log(resp.data,"got resp data here:")
        // set token here

        // sessionStorage.setItem("token", resp.data.token);
        dispatch(getDashboardSuccess(resp.data));
      } catch (error) {
        dispatch(getDashboardFailure(error));
      }
    };
  };