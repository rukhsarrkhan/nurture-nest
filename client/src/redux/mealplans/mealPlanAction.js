import axios from "axios";
import {
  GET_MEALPLAN_SUCCESS,
  GET_MEALPLAN_FAILURE,
  SET_MEALPLAN_SUCCESS,
  SET_MEALPLAN_FAILURE
} from "./mealPlanActionTypes";

export const getMealPlanSuccess = (vaccine) => {
  return {
    type: GET_MEALPLAN_SUCCESS,
    payload: vaccine,
  };
};

export const getMealPlanFailure = (error) => {
  return {
    type: GET_MEALPLAN_FAILURE,
    payload: error,
  };
};

export const mealPlanSetSuccess = (vaccine) => {
  return {
    type: SET_MEALPLAN_SUCCESS,
    payload: vaccine,
  };
};

export const mealPlanSetFailure = (error) => {
  return {
    type: SET_MEALPLAN_FAILURE,
    payload: error,
  };
};

export const getMealPlanAPICall = (childId) => {
  return async (dispatch) => {
    try {
      let resp = await axios.get(`http://localhost:3000/child/mealplan/${childId}`);
      // set token here
      // sessionStorage.setItem("token", resp.data.token);
      dispatch(getMealPlanSuccess(resp.data));
    } catch (error) {
      dispatch(getMealPlanFailure(error));
    }
  };
};

export const mealPlanSetAPICall = (obj,childId) => {
  return async (dispatch) => {
    try {
      let resp = await axios.post('http://localhost:3000/child/mealplan/'+childId, obj);
      // set token here
      // sessionStorage.setItem("token", resp.data.token);
      dispatch(mealPlanSetSuccess(resp.data));
    } catch (error) {
      dispatch(mealPlanSetFailure(error));
    }
  };
};