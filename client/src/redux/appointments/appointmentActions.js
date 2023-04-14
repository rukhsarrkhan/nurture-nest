import axios from "axios";
import {
  GET_APPOINTMENT_SUCCESS,
  GET_APPOINTMENT_FAILURE,
  SET_APPOINTMENT_SUCCESS,
  SET_APPOINTMENT_FAILURE
} from "./appointmentActionTypes";

export const getAppointmentSuccess = (vaccine) => {
  return {
    type: GET_APPOINTMENT_SUCCESS,
    payload: vaccine,
  };
};

export const getAppointmentFailure = (error) => {
  return {
    type: GET_APPOINTMENT_FAILURE,
    payload: error,
  };
};

export const appointmentSetSuccess = (vaccine) => {
  return {
    type: SET_APPOINTMENT_SUCCESS,
    payload: vaccine,
  };
};

export const appointmentSetFailure = (error) => {
  return {
    type: SET_APPOINTMENT_FAILURE,
    payload: error,
  };
};

export const getAppointmentAPICall = (childId) => {
  return async (dispatch) => {
    try {
      let resp = await axios.get('http://localhost:3000/child/appointment/'+childId);
      // set token here
      // sessionStorage.setItem("token", resp.data.token);
      dispatch(getAppointmentSuccess(resp.data));
    } catch (error) {
      dispatch(getAppointmentFailure(error));
    }
  };
};

export const appointmentSetAPICall = (obj,childId) => {
  return async (dispatch) => {
    try {
      let resp = await axios.post('http://localhost:3000/child/appointment/'+childId, obj);
      // set token here
      // sessionStorage.setItem("token", resp.data.token);
      dispatch( appointmentSetSuccess(resp.data));
    } catch (error) {
      dispatch(appointmentSetFailure(error));
    }
  };
};