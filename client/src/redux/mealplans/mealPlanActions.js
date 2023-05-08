import axios from "axios";
import {
  GET_MEALPLAN_SUCCESS,
  GET_MEALPLAN_FAILURE,
  SET_MEALPLAN_SUCCESS,
  SET_MEALPLAN_FAILURE,
  SET_MEAL_TRIGGER,
  MEAL_DELETE_SUCCESS,
  MEAL_DELETE_FAILURE
} from "./mealPlanActionTypes";

export const mealSetTrigger = () => {
  return {
    type: SET_MEAL_TRIGGER
  };
};

export const getMealPlanSuccess = (meal) => {
  return {
    type: GET_MEALPLAN_SUCCESS,
    payload: meal,
  };
};

export const getMealPlanFailure = (error) => {
  return {
    type: GET_MEALPLAN_FAILURE,
    payload: error,
  };
};

export const mealPlanSetSuccess = (meal) => {
  return {
    type: SET_MEALPLAN_SUCCESS,
    payload: meal,
  };
};

export const mealPlanSetFailure = (error) => {
  return {
    type: SET_MEALPLAN_FAILURE,
    payload: error,
  };
};

export const mealDeleteSuccess = (meal) => {
  return {
    type: MEAL_DELETE_SUCCESS,
    payload: meal,
  };
};

export const mealDeleteFailure = (error) => {
  return {
    type: MEAL_DELETE_FAILURE,
    payload: error,
  };
};

export const getMealPlanAPICall = (childId) => {
  return async (dispatch) => {
    try {
      let resp = await axios.get(`http://localhost:3000/child/mealplan/${childId}`);
      // set token here
      // sessionStorage.setItem("token", resp.data.token);
      dispatch(getMealPlanSuccess(resp?.data));
    } catch (error) {
      dispatch(getMealPlanFailure(error));
    }
  };
};

export const mealPlanSetAPICall = (obj, childId) => {
  return async (dispatch) => {
    try {
      dispatch(mealSetTrigger());
      let resp = await axios.post('http://localhost:3000/child/mealplan/' + childId, obj);
      // set token here
      // sessionStorage.setItem("token", resp.data.token);
      dispatch(mealPlanSetSuccess(resp?.data));
    } catch (error) {
      dispatch(mealPlanSetFailure(error));
    }
  };
};

export const delMealAPICall = (mealId) => {
  return async (dispatch) => {
    try {
      dispatch(mealSetTrigger());
      let resp = await axios.delete('http://localhost:3000/child/mealplan/' + mealId);
      // set token here
      // sessionStorage.setItem("token", resp.data.token);
      dispatch(mealDeleteSuccess(resp?.data));
    } catch (error) {
      dispatch(mealDeleteFailure(error));
    }
  };
};