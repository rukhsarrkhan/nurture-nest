import {
  GET_VACCINE_SUCCESS,
  GET_VACCINE_FAILURE,
  SET_VACCINE_SUCCESS,
  SET_VACCINE_FAILURE,
  SET_VACCINE_TRIGGER,
  VACCINE_DELETE_SUCCESS,
  VACCINE_DELETE_FAILURE
} from "./vaccineActionTypes";

const initialState = {
  loading: false,
  data: [],
  deleteSuccess: {},
  error: "",
  status: "",
};

export const vaccineReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_VACCINE_TRIGGER:
      return {
        ...state,
        data: []
      };
    case GET_VACCINE_SUCCESS:
      return {
        ...state,
        data: payload,
        error: "",
        status: "OK",
      };
    case GET_VACCINE_FAILURE:
      return {
        ...state,
        error: payload?.response?.data,
      };
    case SET_VACCINE_SUCCESS:
      return {
        ...state,
        data: payload,
        error: "",
        status: "OK",
      };
    case SET_VACCINE_FAILURE:
      return {
        ...state,
        error: payload?.response?.data,
      };
    case VACCINE_DELETE_SUCCESS:
      return {
        ...state,
        deleteSuccess: payload,
        error: "",
        status: "OK",
      };
    case VACCINE_DELETE_FAILURE:
      return {
        ...state,
        error: payload?.response?.data,
      };
    default:
      return state;
  }
};

export default vaccineReducer;
