import {
  GET_HOME_SUCCESS,
  GET_HOME_FAILURE,
} from './homeActionTypes';
import axios from 'axios';

export const gethomeSuccess = (nanny) => {
  return {
    type: GET_HOME_SUCCESS,
    payload: nanny,
  };
};

export const gethomeFailure = (error) => {
  return {
    type: GET_HOME_FAILURE,
    payload: error,
  };
};

export const gethomeAPICall = (nannyId) => {
  return async (dispatch) => {
    try {
      let resp = await axios.get(`http://localhost:3000/nanny/${nannyId}`);
      dispatch(gethomeSuccess(resp?.data));
    } catch (error) {
      dispatch(gethomeFailure(error));
    }
  };
};