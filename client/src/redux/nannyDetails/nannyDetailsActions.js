import axios from "axios";
import {
  GET_NANNYDETAILS_SUCCESS,
  GET_NANNYDETAILS_FAILURE,
} from "./nannyDetailsActionTypes";

export const getNannyDetailsSuccess = (nanny) => {
  return {
    type: GET_NANNYDETAILS_SUCCESS,
    payload: nanny,
  };
};

export const getNannyDetailsFailure = (error) => {
  return {
    type: GET_NANNYDETAILS_FAILURE,
    payload: error,
  };
};

export const getNannyDetailsAPICall = (nannyId) => {
  return async (dispatch) => {
    try {
      let resp = await axios.get(`http://localhost:3000/nanny/${nannyId}`);
      // set token here
      // sessionStorage.setItem("token", resp.data.token);
      dispatch(getNannyDetailsSuccess(resp?.data));
    } catch (error) {
      dispatch(getNannyDetailsFailure(error));
    }
  };
};