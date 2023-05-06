import {
    GET_NANNYDETAILS_SUCCESS,
    GET_NANNYDETAILS_FAILURE
  } from "./nannyDetailsActionTypes"
    
  const initialState = {
    loading: false,
    data: [],
    error: "",
    status: "",
  };
  
  export const nannyDetailsReducer = (state = initialState, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case GET_NANNYDETAILS_SUCCESS:
        return {
          ...state,
          data: payload,
          error: "",
          status: "OK",
        };
      case GET_NANNYDETAILS_FAILURE:
        return {
          ...state,
          error: payload.response.data,
        };
        default:
          return state;
    }
  };
  
  export default nannyDetailsReducer;