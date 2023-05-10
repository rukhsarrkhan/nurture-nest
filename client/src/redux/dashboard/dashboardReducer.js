import {
  GET_DASHBOARD_FAILURE,
  GET_DASHBOARD_SUCCESS,
  SET_DASHBOARD_SUCCESS,
  SET_DASHBOARD_FAILURE
} from './dashboardActionTypes';

const initialState = {
  loading: false,
  data: {},
  error: "",
  code: "",
  status: "",
};

export const dashboardReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_DASHBOARD_SUCCESS:
      return {
        ...state,
        data: payload,
        error: "",
        status: "OK",
        code: "",
      };

    case GET_DASHBOARD_FAILURE:
      return {
        ...state,
        error: payload?.response?.data?.message,
        code: payload?.response?.status,
      };
    case SET_DASHBOARD_SUCCESS:
      return {
        ...state,
        data: payload,
        error: "",
        status: "OK",
        code: "",
      };
    case SET_DASHBOARD_FAILURE:
      return {
        ...state,
        error: payload?.response?.data?.message,
        code: payload?.response?.status,
      };
    default:
      return state;
  }
};

export default dashboardReducer;
