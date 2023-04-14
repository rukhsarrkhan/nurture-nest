import { v4 as uuid } from "uuid";
import {
  GET_VACCINE_SUCCESS,
  GET_VACCINE_FAILURE,
  SET_VACCINE_SUCCESS,
  SET_VACCINE_FAILURE
} from "./vaccineActionTypes";

const initialState = {
  loading: false,
  data: [],
  error: "",
  status: "",
};

export const vaccineReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
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
        error: payload.response.data,
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
          error: payload.response.data,
        };
    default:
      return state;
  }
};

export default vaccineReducer;
