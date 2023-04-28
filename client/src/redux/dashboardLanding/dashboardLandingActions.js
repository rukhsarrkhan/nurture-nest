import {
  GET_DASHBOARDLANDING_SUCCESS,
  GET_DASHBOARDLANDING_FAILURE,
} from './dashboardLandingActionTypes'
import axios from 'axios'

export const getDashboardLandingSuccess = (nanny) => {
  return {
    type: GET_DASHBOARDLANDING_SUCCESS,
    payload: nanny,
  };
};

export const getDashboardLandingFailure = (error) => {
  return {
    type: GET_DASHBOARDLANDING_FAILURE,
    payload: error,
  };
};

export const getDashboardLandingAPICall = (nannyId) => {
  console.log(nannyId, "nannyId in a ction call")
  return async (dispatch) => {
    try {
      let resp = await axios.get(`http://localhost:3000/nanny/${nannyId}`);
      console.log(resp.data, "got resp data here:")
      // set token here

      // sessionStorage.setItem("token", resp.data.token);
      dispatch(getDashboardLandingSuccess(resp.data));
    } catch (error) {
      dispatch(getDashboardLandingFailure(error));
    }
  };
};