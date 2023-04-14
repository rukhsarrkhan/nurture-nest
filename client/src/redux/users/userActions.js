import axios from "axios";
import {
  USER_LOGIN,
  USER_LOGOUT,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FALIURE,
  USER_REGISTER_SUCCESS,
  USER_REGISTER,
  USER_REGISTER_FALIURE,
} from "./userActionTypes";

export const userLogin = () => {
  return {
    type: USER_LOGIN,
  };
};

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

export const userRegister = () => {
  return {
    type: USER_REGISTER,
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
  console.log("obj",obj)
  return async (dispatch) => {
    dispatch(userRegister());
    try {
      console.log("now")
      let resp = await axios.post("http://localhost:3000/register", obj);
      console.log("resp",resp)
      dispatch(userRegisterSuccess(resp.data));
      // set token here
      // localStorage.setItem("authToken", resp.data.token);
    } catch (error) {
      console.log("error",error)
      dispatch(userRegisterFailure(error));
    }
  };
};

export const userLoginAPICall = (obj) => {
  return async (dispatch) => {
    dispatch(userLogin());
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
