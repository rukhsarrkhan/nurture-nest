import axios from "axios";
import {
VACCINE_ADD,
 VACCINE_ADD_SUCCESS,
 VACCINE_ADD_FALIURE 
} from "./vaccineActionTypes"

export const vaccineAdd = () => {
    console.log("dispatched vaccine")
    return {
      type: VACCINE_ADD,
    };
  };

export const vaccineAddSuccess = (vaccines) => {
    return {
      type: VACCINE_ADD_SUCCESS,
      payload: vaccines,
    };
  };

  export const vaccineAddFailure = (error) => {
    return {
      type: VACCINE_ADD_FALIURE,
      payload: error,
    };
  };


  export const vaccineDataAPICall = (obj) => {
    console.log("obj in vaccine api",obj)
    return async (dispatch) => {
      dispatch(vaccineAdd());
      try {
        let resp = await axios.post("http://localhost:3000/vaccine/1", obj);
        console.log("resp in vaccine api call",resp)
        dispatch(vaccineAddSuccess(resp.data));
        // set token here
        // localStorage.setItem("authToken", resp.data.token);
      } catch (error) {
        console.log("error",error)
        dispatch(vaccineAddFailure(error));
      }
    };
  };
  