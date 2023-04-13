import axios from "axios";
import {
  USER_LOGOUT,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FALIURE,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FALIURE,
} from "./userActionTypes";

export const userLogout = () => {
  return {
    type: USER_LOGOUT,
  };
};

export const userLoginSuccess = (user) => {
  return {
    type: USER_LOGIN_SUCCESS,
    payload: user,
  };
};

export const userLoginFailure = (error) => {
  return {
    type: USER_LOGIN_FALIURE,
    payload: error,
  };
};

export const userRegisterSuccess = (user) => {
  return {
    type: USER_REGISTER_SUCCESS,
    payload: user,
  };
};

export const userRegisterFailure = (error) => {
  return {
    type: USER_REGISTER_FALIURE,
    payload: error,
  };
};

export const userRegistrationAPICall = (obj) => {
  return async (dispatch) => {
    try {
      let resp = await axios.post("http://localhost:3000/users/signup", obj);
      dispatch(userRegisterSuccess(resp.data));
      // set token here
      // localStorage.setItem("authToken", resp.data.token);
    } catch (error) {
      dispatch(userRegisterFailure(error));
    }
  };
};

export const userLoginAPICall = (obj) => {
  return async (dispatch) => {
    try {
      let resp = await axios.post("http://localhost:3000/login", obj);
      // set token here
      // sessionStorage.setItem("token", resp.data.token);
      dispatch(userLoginSuccess(resp.data));
    } catch (error) {
      dispatch(userLoginFailure(error));
    }
  };
};

export const userLogoutCall = (obj) => {
  return async (dispatch) => {
    dispatch(userLogout());
    // remove token here
    // localStorage.removeItem("authToken");
  };
};
