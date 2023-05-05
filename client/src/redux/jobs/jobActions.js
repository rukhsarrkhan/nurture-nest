import axios from "axios";
import { CREATE_JOB, CREATE_JOB_SUCCESS, CREATE_JOB_FALIURE, DELETE_JOB_SUCCESS, DELETE_JOB_FALIURE, SHOW_ALL_APPLICANTS_SUCCESS, SEARCH_INITIATE, SHOW_ALL_APPLICANTS_FAILURE, SEARCH_APPLICANTS_SUCCESS, SEARCH_APPLICANTS_FAILURE, SELECT_NANNY_SUCCESS, SELECT_NANNY_FAILURE, GET_MY_JOB_SUCCESS, GET_MY_JOB_FAILURE, GET_ALL_JOBS_SUCCESS, GET_ALL_JOBS_FAILURE, SEARCH_JOBS_SUCCESS, SEARCH_JOBS_FAILURE, APPLY_TO_JOB_SUCCESS, APPLY_TO_JOB_FAILURE,VIEW_ALL_MY_APPLIED_JOBS_SUCCESS,VIEW_ALL_MY_APPLIED_JOBS_FAILURE ,EXIT_JOB_SUCCESS ,EXIT_JOB_FAILURE } from "./jobActionTypes";

export const searchInitiate = () => {
  return {
    type: SEARCH_INITIATE,
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

export const deleteJobSuccess = (job) => {
  return {
    type: DELETE_JOB_SUCCESS,
    payload: job,
  };
};

export const deleteJobFailure = (error) => {
  return {
    type: DELETE_JOB_FALIURE,
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

export const searchApplicantsSuccess = (job) => {
  return {
    type: SEARCH_APPLICANTS_SUCCESS,
    payload: job,
  };
};

export const searchApplicantsFailure = (error) => {
  return {
    type: SEARCH_APPLICANTS_FAILURE,
    payload: error,
  };
};


export const selectNannySuccess = (job) => {
  return {
    type: SELECT_NANNY_SUCCESS,
    payload: job,
  };
};

export const selectNannyFailure = (error) => {
  return {
    type: SELECT_NANNY_FAILURE,
    payload: error,
  };
};

export const getMyJobSuccess = (job) => {
  return {
    type: GET_MY_JOB_SUCCESS,
    payload: job,
  };
};

export const getMyJobFailure = (error) => {
  return {
    type: GET_MY_JOB_FAILURE,
    payload: error,
  };
};

export const getAllJobsSuccess = (job) => {
  return {
    type: GET_ALL_JOBS_SUCCESS,
    payload: job,
  };
};

export const getAllJobsFailure = (error) => {
  return {
    type: GET_ALL_JOBS_FAILURE,
    payload: error,
  };
};

export const searchJobsSuccess = (job) => {
  return {
    type: SEARCH_JOBS_SUCCESS,
    payload: job,
  };
};

export const searchJobsFailure = (error) => {
  return {
    type: SEARCH_JOBS_FAILURE,
    payload: error,
  };
};

export const  viewAllMyAppliedJobsSuccess = (job) => {
  return {
    type: VIEW_ALL_MY_APPLIED_JOBS_SUCCESS,
    payload: job,
  };
};

export const viewAllMyAppliedJobsFailure = (error) => {
  return {
    type: VIEW_ALL_MY_APPLIED_JOBS_FAILURE,
    payload: error,
  };
};

export const exitJobSuccess = (job) => {
  return {
    type: EXIT_JOB_SUCCESS,
    payload: job,
  };
};

export const exitJobFailure = (error) => {
  return {
    type: EXIT_JOB_FAILURE,
    payload: error,
  };
};

export const  applyToJobSuccess = (job) => {
  return {
    type: APPLY_TO_JOB_SUCCESS,
    payload: job,
  };
};

export const applyToJobFailure = (error) => {
  return {
    type: APPLY_TO_JOB_FAILURE,
    payload: error,
  };
};

export const createJobAPICall = (obj, parentId, childId) => {
  console.log("obj in API call", obj, parentId, childId);
  return async (dispatch) => {
    try {
      console.log("now");
      let resp = await axios.post(`http://localhost:3000/job/${parentId}/${childId}/createJob`, obj);
      console.log("resp", resp);
      dispatch(createJobSuccess(resp.data));
    } catch (error) {
      console.log("error", error);
      dispatch(createJobFailure(error));
    }
  };
};

export const deleteJobAPICall = (jobId) => {
  console.log("obj in API call", jobId);
  return async (dispatch) => {
    try {
      console.log("now");
      let resp = await axios.delete(`http://localhost:3000/job/${jobId}`);
      console.log("resp", resp);
      dispatch(deleteJobSuccess(resp.data));
    } catch (error) {
      console.log("error", error);
      dispatch(deleteJobFailure(error));
    }
  };
};

export const showAllApplicantsAPICall = (jobId, pageNum) => {
  return async (dispatch) => {
    try {
      console.log(jobId, pageNum, "hallooo here");
      let resp = await axios.get(`http://localhost:3000/job/${jobId}/allApplicants/${pageNum}`);
      console.log("axios call got:", resp);
      dispatch(showAllApplicantsSuccess(resp.data));
    } catch (error) {
      console.log("error", error);
      dispatch(showAllApplicantsFailure(error));
    }
  };
};

export const searchApplicantsAPICall = (jobId, searchTerm, pageNum) => {
  return async (dispatch) => {
    try {
      dispatch(searchInitiate());
      console.log(jobId, searchTerm, pageNum, "hallooo here");
      let resp = await axios.get(`http://localhost:3000/job/${jobId}/searchApplicants/${searchTerm}/${pageNum}`);
      console.log("axios call got:", resp);
      dispatch(searchApplicantsSuccess(resp.data));
    } catch (error) {
      console.log("error", error);
      dispatch(searchApplicantsFailure(error));
    }
  };
};

export const selectNannyAPICall = (jobId, nannyId) => {
  return async (dispatch) => {
    try {
      console.log("jobId:", jobId, "nannyId:", nannyId, "hallooo here");
      let resp = await axios.post(`http://localhost:3000/job/${jobId}/setNanny/${nannyId}`);
      console.log("axios call got:", resp);
      dispatch(selectNannySuccess(resp.data));
    } catch (error) {
      console.log("error", error);
      dispatch(selectNannyFailure(error));
    }
  };
};

export const getMyJobAPICall = (jobId) => {
  console.log("In API call getMyJob with jobId:", jobId);
  return async (dispatch) => {
    try {
      console.log("now");
      let resp = await axios.get(`http://localhost:3000/job/${jobId}`);
      console.log("resp", resp);
      dispatch(getMyJobSuccess(resp.data));
    } catch (error) {
      console.log("error", error);
      dispatch(getMyJobFailure(error));
    }
  };
};

export const getallJobsAPICall = (pageNum) => {
  console.log("In API call getAllJobs", pageNum);
  return async (dispatch) => {
    try {
      console.log("now");
      let resp = await axios.get(`http://localhost:3000/job/getJobs/AllJobs/${pageNum}`);
      console.log("resp", resp);
      dispatch(getAllJobsSuccess(resp.data));
    } catch (error) {
      console.log("error", error);
      dispatch(getAllJobsFailure(error));
    }
  };
};

export const searchJobsAPICall = (searchTerm, pageNum) => {
  console.log("In API call getAllJobs", searchTerm, pageNum);
  return async (dispatch) => {
    try {
      console.log("now");
      let resp = await axios.get(`http://localhost:3000/job/searchJobs/${searchTerm}/${pageNum}`);
      console.log("resp", resp);
      dispatch(searchJobsSuccess(resp.data));
    } catch (error) {
      console.log("error", error);
      dispatch(searchJobsFailure(error));
    }
  };
};

export const applyToJobAPICall = (obj, nannyId, jobId) => {
  console.log("obj in API call", obj, nannyId, jobId);
  return async (dispatch) => {
    try {
      console.log("now");
      let resp = await axios.put(`http://localhost:3000/job/${jobId}/apply/${nannyId}`, obj);
      console.log("resp", resp);
      dispatch(applyToJobSuccess(resp.data));
    } catch (error) {
      console.log("error", error);
      dispatch(applyToJobFailure(error));
    }
  };
};

export const getAllMyAppliedJobsAPICall = () => {
  console.log("In API call getAllMyAppliedJobsAPICall");
  return async (dispatch) => {
    try {
      console.log("now");
      let resp = await axios.get(`http://localhost:3000/job/`);
      console.log("resp", resp);
      dispatch(viewAllMyAppliedJobsSuccess(resp.data));
    } catch (error) {
      console.log("error", error);
      dispatch(viewAllMyAppliedJobsFailure(error));
    }
  };
};

export const exitJobAPICall = (jobId) => {
  console.log("obj in API call", jobId);
  return async (dispatch) => {
    try {
      console.log("now");
      let resp = await axios.delete(`http://localhost:3000/job/`);
      console.log("resp", resp);
      dispatch(deleteJobSuccess(resp.data));
    } catch (error) {
      console.log("error", error);
      dispatch(deleteJobFailure(error));
    }
  };
};