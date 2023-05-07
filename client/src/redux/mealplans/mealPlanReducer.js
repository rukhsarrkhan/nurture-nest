import {
  GET_MEALPLAN_SUCCESS,
  GET_MEALPLAN_FAILURE,
  SET_MEALPLAN_SUCCESS,
  SET_MEALPLAN_FAILURE,
  SET_MEAL_TRIGGER,
  MEAL_DELETE_SUCCESS,
  MEAL_DELETE_FAILURE
} from "./mealPlanActionTypes";

const initialState = {
  loading: false,
  data: [],
  deleteSuccess: {},
  error: "",
  status: "",
};

export const mealPlanReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_MEAL_TRIGGER:
      return {
        ...state,
        data: []
      };
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
        error: payload?.response?.data,
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
        error: payload?.response?.data,
      };
    case MEAL_DELETE_SUCCESS:
      return {
        ...state,
        deleteSuccess: payload,
        error: "",
        status: "OK",
      };
    case MEAL_DELETE_FAILURE:
      return {
        ...state,
        error: payload?.response?.data,
      };
    default:
      return state;
  }
};

export default mealPlanReducer;