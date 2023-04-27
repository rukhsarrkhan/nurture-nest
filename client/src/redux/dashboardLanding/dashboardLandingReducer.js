import {
    GET_DASHBOARDLANDING_FAILURE,
    GET_DASHBOARDLANDING_SUCCESS,
} from './dashboardLandingActionTypes'

const initialState = {
    loading: false,
    data: {},
    error: "",
    status: "",
  };

  export const dashboardLandingReducer = (state = initialState, action) => {
    const { type, payload } = action;
    console.log("action",action)
  
    switch (type) {
      case GET_DASHBOARDLANDING_SUCCESS:
        console.log("payload",payload);
        console.log(state,"state is here")
        return {
          ...state,
          data: payload,
          error: "",
          status: "OK",
        };

      case GET_DASHBOARDLANDING_FAILURE:
        return {
          ...state,
          error: payload.response.data,
        };
      default:
        return state;
    }
  };
  
  export default dashboardLandingReducer;
