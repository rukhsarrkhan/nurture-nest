import {
  GET_APPOINTMENT_SUCCESS,
  GET_APPOINTMENT_FAILURE,
  SET_APPOINTMENT_SUCCESS,
  SET_APPOINTMENT_FAILURE,
  SET_APPOINTMENT_TRIGGER,
  APPOINTMENT_DELETE_SUCCESS,
  APPOINTMENT_DELETE_FAILURE
} from "./appointmentActionTypes";

const initialState = {
  loading: false,
  data: [],
  deleteSuccess: {},
  error: "",
  code: "",
  status: "",
};

export const appointmentReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_APPOINTMENT_TRIGGER:
      return {
        ...state,
        data: [],
        error: "",
        code: "",
        status: "",
      };
    case GET_APPOINTMENT_SUCCESS:
      return {
        ...state,
        data: payload,
        error: "",
        status: "OK",
        code: "",
      };
    case GET_APPOINTMENT_FAILURE:
      return {
        ...state,
        error: payload?.response?.data?.message,
        code: payload?.response?.status,
      };
    case SET_APPOINTMENT_SUCCESS:
      return {
        ...state,
        data: payload,
        error: "",
        status: "OK",
        code: "",
      };
    case SET_APPOINTMENT_FAILURE:
      return {
        ...state,
        error: payload?.response?.data?.message,
        code: payload?.response?.status,
      };
    case APPOINTMENT_DELETE_SUCCESS:
      return {
        ...state,
        deleteSuccess: payload,
        error: "",
        status: "OK",
        code: "",
      };
    case APPOINTMENT_DELETE_FAILURE:
      return {
        ...state,
        error: payload?.response?.data?.message,
        code: payload?.response?.status,
      };
    default:
      return state;
  }
};

export default appointmentReducer;

