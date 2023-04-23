import {
    GET_DASHBOARD_SUCCESS,
    GET_DASHBOARD_FAILURE,
    SET_DASHBOARD_SUCCESS,
    SET_DASHBOARD_FAILURE
} from './dashboardActionTypes'
import axios from 'axios'

export const getDashboardSuccess = (nanny) => {
    return {
      type: GET_DASHBOARD_SUCCESS,
      payload: nanny,
    };
  };

export const getDashboardFailure = (error) => {
    return {
      type: GET_DASHBOARD_FAILURE,
      payload: error,
    };
  };

export const dashboardSetSuccess = (nanny) => {
    return {
      type: SET_DASHBOARD_SUCCESS,
      payload: nanny,
    };
  };

export const dashboardSetFailure = (error) => {
    return {
      type: SET_DASHBOARD_FAILURE,
      payload: error,
    };
  };

  export const getDashboardAPICall = (nannyId) => {
    console.log(nannyId,"nannyId in a ction call")
    return async (dispatch) => {
      try {
        let resp = await axios.get(`http://localhost:3000/nanny/dashboard/${nannyId}`);
        console.log(resp,"got resp here:")
        // set token here

        // sessionStorage.setItem("token", resp.data.token);
        dispatch(getDashboardSuccess(resp.data));
      } catch (error) {
        dispatch(getDashboardFailure(error));
      }
    };
  };