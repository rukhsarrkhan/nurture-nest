import { v4 as uuid } from "uuid";
import {
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FALIURE,
  USER_LOGOUT,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FALIURE,
} from "./userActionTypes";

// const initalState = [
//     {
//         id: uuid(),
//         name: 'Patrick Hill',
//         email: 'phill@stevens.edu'
//     }
// ];

const initialState = {
  userLoggedIn: false,
  loading: false,
  data: {},
  error: "",
  status: "",
};

export const userReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        userLoggedIn: true,
        data: payload,
        error: "",
        status: "OK",
      };
    case USER_LOGIN_FALIURE:
      return {
        ...state,
        userLoggedIn: false,
        error: payload.response.data,
      };
    case USER_LOGOUT:
      return {
        ...initialState,
      };
    case USER_REGISTER_SUCCESS:
      return {
        ...state,
        data: payload,
        error: "",
        status: "OK",
      };
    case USER_REGISTER_FALIURE:
      return {
        ...state,
        error: payload.response.data,
      };
    default:
      return state;
  }
};

export default userReducer;
