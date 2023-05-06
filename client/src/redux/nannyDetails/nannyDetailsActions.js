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
      let resp = await axios.get(`http://localhost:3000/nanny/${nannyId}`);
      let resp2 = await axios.get(`http://localhost:3000/job/findjob/${childId}`);

      let newObj = {
        firstName: resp.data.firstName,
        lastName: resp.data.LastName,
        image: resp.data.photoUrl,
        email: resp.data.email,
        age: resp.data.age,
        distance: resp2.data.distance,
        address: resp2.data.nannyAddress,
        reasonToSelect: resp2.data.whySelect,
        experience: resp2.data.experience,
        disability: resp2.data.disability,
        attachment: resp2.data.attachment,
        punctuality: resp2.data.shiftPunctuality
      }

      // set token here
      // sessionStorage.setItem("token", resp.data.token);
      dispatch(getNannyDetailsSuccess(newObj));
    } catch (error) {
      console.log(error)
      dispatch(getNannyDetailsFailure(error));
    }
  };
};