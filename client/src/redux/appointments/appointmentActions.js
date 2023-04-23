import axios from "axios";
import {
  GET_APPOINTMENT_SUCCESS,
  GET_APPOINTMENT_FAILURE,
  SET_APPOINTMENT_SUCCESS,
  SET_APPOINTMENT_FAILURE,
  APPOINTMENT_DELETE_SUCCESS,
  APPOINTMENT_DELETE_FAILURE
} from "./appointmentActionTypes";

export const getAppointmentSuccess = (appointment) => {
  return {
    type: GET_APPOINTMENT_SUCCESS,
    payload: appointment,
  };
};

export const getAppointmentFailure = (error) => {
  return {
    type: GET_APPOINTMENT_FAILURE,
    payload: error,
  };
};

export const appointmentSetSuccess = (appointment) => {
  return {
    type: SET_APPOINTMENT_SUCCESS,
    payload: appointment,
  };
};

export const appointmentSetFailure = (error) => {
  return {
    type: SET_APPOINTMENT_FAILURE,
    payload: error,
  };
};

export const appointmentDeleteSuccess = (appointment) => {
  return {
    type:  APPOINTMENT_DELETE_SUCCESS,
    payload: appointment,
  };
};

export const appointmentDeleteFailure = (error) => {
  return {
    type:  APPOINTMENT_DELETE_FAILURE,
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

export const delAppointmentAPICall = (appointmentId) => {
  return async (dispatch) => {
    try {
      let resp = await axios.delete('http://localhost:3000/child/appointment/'+appointmentId);
      // set token here
      // sessionStorage.setItem("token", resp.data.token);
       dispatch(appointmentDeleteSuccess(resp.data));
    } catch (error) {
       dispatch(appointmentDeleteFailure(error));
    }
  };
};