import {
    GET_MEALPLAN_SUCCESS,
    GET_MEALPLAN_FAILURE,
    SET_MEALPLAN_SUCCESS,
    SET_MEALPLAN_FAILURE
  } from "./mealPlanActionTypes"
    
  const initialState = {
    loading: false,
    data: [],
    error: "",
    status: "",
  };
  
  export const mealPlanReducer = (state = initialState, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case GET_MEALPLAN_SUCCESS:
        return {
          ...state,
          data: payload,
          error: "",
          status: "OK",
        };
      case GET_MEALPLAN_FAILURE:
        return {
          ...state,
          error: payload.response.data,
        };
        case SET_MEALPLAN_SUCCESS:
          return {
            ...state,
            data: payload,
            error: "",
            status: "OK",
          };
        case SET_MEALPLAN_FAILURE:
          return {
            ...state,
            error: payload.response.data,
          };
      default:
        return state;
    }
  };
  
  export default mealPlanReducer;
  