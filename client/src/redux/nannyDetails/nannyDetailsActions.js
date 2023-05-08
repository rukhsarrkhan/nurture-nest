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

export const getNannyDetailsAPICall = (childId) => {
  return async (dispatch) => {
    try {

      let resp2 = await axios.get(`http://localhost:3000/job/findjob/${childId}`);
      let nannyId = resp2?.data?.nannyId;
      let nannyInfoFromUserCollection = await axios.get(`http://localhost:3000/nanny/` + nannyId);
      let newObj = {
        name: resp2?.data?.nannyName,
        contact: resp2?.data?.contact,
        city: resp2?.data?.city,
        state: resp2?.data?.state,
        zipCode: resp2?.data?.zipCode,
        photoUrl: nannyInfoFromUserCollection?.data?.photoUrl,
        distance: resp2?.data?.distance,
        address: resp2?.data?.nannyAddress,
        reasonToSelect: resp2?.data?.whySelect,
        experience: resp2?.data?.experience,
        disability: resp2?.data?.disability,
        attachment: resp2?.data?.attachment,
        punctuality: resp2?.data?.shiftPunctuality
      };
      dispatch(getNannyDetailsSuccess(newObj));
    } catch (error) {
      console.log(error);
      dispatch(getNannyDetailsFailure(error));
    }
  };
};