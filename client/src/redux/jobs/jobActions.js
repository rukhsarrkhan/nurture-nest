import axios from "axios";
import { CREATE_JOB, CREATE_JOB_SUCCESS, CREATE_JOB_FALIURE } from "./jobActionTypes";

  export const createJob = () => {
    console.log("dispatched createJob")
    return {
      type: CREATE_JOB,
    };
  };

  export const createJobSuccess = (job) => {
    return {
      type: CREATE_JOB_SUCCESS,
      payload: job,
    };
  };
  
  export const createJobFailure = (error) => {
    return {
      type: CREATE_JOB_FALIURE,
      payload: error,
    };
  };
  
  export const createJobAPICall = (obj) => {
    console.log("obj in API call",obj)
    return async (dispatch) => {
      dispatch(createJob());
      try {
        console.log("now")
        let resp = await axios.post("http://localhost:3000/job/createJob", obj);
        console.log("resp",resp)
        dispatch(createJobSuccess(resp.data));
      } catch (error) {
        console.log("error",error)
        dispatch(createJobFailure(error));
      }
    };
  };