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

export const getNannyDetailsAPICall = (nannyId, childId) => {
  return async (dispatch) => {
    try {
      // THIS NEEDS TO BE REFACTORED
      // CHECK WHAT HAPPENS IN SUCCESS SCENARIO - RUKHSAR
      let { data } = await axios.get(`http://localhost:3000/nanny/` + nannyId);
      dispatch(getNannyDetailsSuccess(data));
    } catch (error) {
      dispatch(getNannyDetailsFailure(error));
    }
  };
};