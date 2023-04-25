import {
    GET_DASHBOARD_FAILURE,
    GET_DASHBOARD_SUCCESS,
    SET_DASHBOARD_SUCCESS,
    SET_DASHBOARD_FAILURE
} from './dashboardActionTypes'

const initialState = {
    loading: false,
    data: {},
    error: "",
    status: "",
  };

  export const dashboardReducer = (state = initialState, action) => {
    const { type, payload } = action;
    console.log("action",action)
  
    switch (type) {
      case GET_DASHBOARD_SUCCESS:
        console.log("payload",payload);
        console.log(state,"state is here")
        return {
          ...state,
          data: payload,
          error: "",
          status: "OK",
        };

      case GET_DASHBOARD_FAILURE:
        return {
          ...state,
          error: payload.response.data,
        };
        case SET_DASHBOARD_SUCCESS:
          return {
            ...state,
            data: payload,
            error: "",
            status: "OK",
          };
        case SET_DASHBOARD_FAILURE:
          return {
            ...state,
            error: payload.response.data,
          };
      default:
        return state;
    }
  };
  
  export default dashboardReducer;