import {
  CREATE_JOB_SUCCESS,
  CREATE_JOB_FALIURE,
  DELETE_JOB_SUCCESS,
  DELETE_JOB_FALIURE,
  SHOW_ALL_APPLICANTS_SUCCESS,
  SEARCH_INITIATE,
  SHOW_ALL_APPLICANTS_FAILURE,
  SEARCH_APPLICANTS_SUCCESS,
  SEARCH_APPLICANTS_FAILURE,
  SELECT_NANNY_SUCCESS,
  SELECT_NANNY_FAILURE,
  GET_MY_JOB_SUCCESS,
  GET_MY_JOB_FAILURE,
  GET_ALL_JOBS_SUCCESS,
  GET_ALL_JOBS_FAILURE,
  SEARCH_JOBS_SUCCESS,
  SEARCH_JOBS_FAILURE,
  APPLY_TO_JOB_SUCCESS,
  APPLY_TO_JOB_FAILURE,
  VIEW_ALL_MY_APPLIED_JOBS_SUCCESS,
  VIEW_ALL_MY_APPLIED_JOBS_FAILURE,
  EXIT_JOB_SUCCESS,
  EXIT_JOB_FAILURE,
  FIRE_NANNY_SUCCESS,
  FIRE_NANNY_FAILURE
} from "./jobActionTypes";

const initialState = {
  loading: false,
  data: {},
  applicantsData: {},
  jobsData: {},
  myAppliedJobs: [],
  error: "",
  code:"",
  status: "",
};

export const jobReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_JOB_SUCCESS:
      return {
        ...state,
        data: payload,
        error: "",
        status: "OK",
      };
    case CREATE_JOB_FALIURE:
      return {
        ...state,
        error: payload.response.data,
      };
    case DELETE_JOB_SUCCESS:
      return {
        ...state,
        error: "",
        status: payload,
      };
    case DELETE_JOB_FALIURE:
      return {
        ...state,
        error: payload?.response?.data?.message,
        code: payload?.response?.status,
      };
    case SHOW_ALL_APPLICANTS_SUCCESS:
      return {
        ...state,
        applicantsData: payload,
        error: "",
        status: "OK",
      };
    case SHOW_ALL_APPLICANTS_FAILURE:
      return {
        ...state,
        error: payload?.response?.data?.message,
        code: payload?.response?.status,
      };
    case SEARCH_APPLICANTS_SUCCESS:
      return {
        ...state,
        applicantsData: payload,
        error: "",
        status: "OK",
      };
    case SEARCH_APPLICANTS_FAILURE:
      return {
        ...state,
        error: payload?.response?.data?.message,
        code: payload?.response?.status,
      };
    case SELECT_NANNY_SUCCESS:
      return {
        ...state,
        data: payload,
        error: "",
        status: "OK",
      };
    case SELECT_NANNY_FAILURE:
      return {
        ...state,
        error: payload.response.data,
      };
    case GET_MY_JOB_SUCCESS:
      return {
        ...state,
        data: payload,
        error: "",
        status: "OK",
      };
    case GET_MY_JOB_FAILURE:
      return {
        ...state,
        error: payload.response.data,
      };
    case GET_ALL_JOBS_SUCCESS:
      return {
        ...state,
        jobsData: payload,
        error: "",
        status: "OK",
      };
    case GET_ALL_JOBS_FAILURE:
      return {
        ...state,
        error: payload?.response?.data?.message,
        code: payload?.response?.status,
      };
    case SEARCH_JOBS_SUCCESS:
      return {
        ...state,
        jobsData: payload,
        error: "",
        status: "OK",
      };
    case SEARCH_JOBS_FAILURE:
      return {
        ...state,
        error: payload?.response?.data?.message,
        code: payload?.response?.status,
      };
    case APPLY_TO_JOB_SUCCESS:
      return {
        ...state,
        data: payload,
        error: "",
        status: "OK",
      };
    case APPLY_TO_JOB_FAILURE:
      return {
        ...state,
        error: payload.response.data,
      };
    case SEARCH_INITIATE:
      return {
        ...state,
        applicantsData: [],
      };
    case VIEW_ALL_MY_APPLIED_JOBS_SUCCESS:
      console.log("payload", payload);
      return {
        ...state,
        myAppliedJobs: payload,
        error: "",
        status: "OK",
      };
    case VIEW_ALL_MY_APPLIED_JOBS_FAILURE:
      return {
        ...state,
        error: payload.response.data,
      };
    case EXIT_JOB_SUCCESS:
      return {
        ...state,
        error: "",
        status: payload,
      };
    case EXIT_JOB_FAILURE:
      return {
        ...state,
        error: payload.response.data,
      };
      case FIRE_NANNY_SUCCESS:
      return {
        ...state,
        error: "",
        status: payload,
      };
    case FIRE_NANNY_FAILURE:
      return {
        ...state,
        error: payload.response.data,
      };
    default:
      return state;
  }
};

export default jobReducer;
