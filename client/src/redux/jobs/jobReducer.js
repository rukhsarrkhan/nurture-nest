import { v4 as uuid } from "uuid";
import { CREATE_JOB, CREATE_JOB_SUCCESS, CREATE_JOB_FALIURE } from "./jobActionTypes";

const initialState = {
  loading: false,
  data: {},
  error: "",
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
      console.log(payload)
      return {
        ...state,
        error: payload.response.data,
      };
    default:
      return state;
  }
};

export default jobReducer;