import axios from "axios";
import { CREATE_JOB, CREATE_JOB_SUCCESS, CREATE_JOB_FALIURE ,SHOW_ALL_APPLICANTS_SUCCESS , SHOW_ALL_APPLICANTS_FAILURE,GET_APPLICANT_SUCCESS, GET_APPLICANT_FAILURE } from "./jobActionTypes";

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
  

  export const showAllApplicantsSuccess = (job) => {
    return {
      type: SHOW_ALL_APPLICANTS_SUCCESS,
      payload: job,
    };
  };
  
  export const showAllApplicantsFailure = (error) => {
    return {
      type: SHOW_ALL_APPLICANTS_FAILURE,
      payload: error,
    };
  };
  
  
  export const getApplicantSuccess = (job) => {
    return {
      type: SHOW_ALL_APPLICANTS_SUCCESS,
      payload: job,
    };
  };
  
  export const getApplicantFailure = (error) => {
    return {
      type: SHOW_ALL_APPLICANTS_FAILURE,
      payload: error,
    };
  };
  

  export const createJobAPICall = (obj) => {
    console.log("obj in API call",obj)
    return async (dispatch) => {
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

  export const showAllApplicantsAPICall = (jobId,pageNum) => {
    return async (dispatch) => {
      try {
        console.log(jobId,pageNum,"hallooo here")
        let resp = await axios.get(`http://localhost:3000/job/${jobId}/allApplicants/${pageNum}`);
        console.log("axios call got:",resp)
        dispatch(showAllApplicantsSuccess(resp.data));
      } catch (error) {
        console.log("error",error)
        dispatch(showAllApplicantsFailure(error));
      }
    };
  };

  export const getApplicantAPICall = (jobId,applicantId) => {
    return async (dispatch) => {
      try {
        console.log(jobId,applicantId,"hallooo here")
        let resp = await axios.get(`http://localhost:3000/job/${jobId}/Applicantion/${applicantId}`);
        console.log("axios call got:",resp)
        dispatch(getApplicantSuccess(resp.data));
      } catch (error) {
        console.log("error",error)
        dispatch(getApplicantFailure(error));
      }
    };
  };