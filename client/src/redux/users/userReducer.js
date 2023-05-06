// import { v4 as uuid } from "uuid";
import {
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FALIURE,
    USER_LOGOUT,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FALIURE,
    SET_USER_PROFILE,
    SET_PROFILE_FAILURE,
    SET_PROFILE_SUCCESS,
    USER_ID_STORE,
    USER_INITIATE,
} from "./userActionTypes";
import { doSignInWithEmailAndPassword, doPasswordReset, doSignOut } from '../../firebase/FirebaseFunctions';

const initialState = {
    userLoggedIn: false,
    loading: false,
    data: {},
    error: "",
    status: "",
    userProfile: null,
    userId: ""
};

export const userReducer = (state = initialState, action) => {

    const { type, payload } = action;
    switch (type) {
        case USER_INITIATE:
            return {
                ...state,
                data: {},
                error: ""
            };
        case USER_LOGIN_SUCCESS:
            return {
                ...state,
                userLoggedIn: true,
                data: payload,
                error: "",
                status: "OK",
                userProfile: payload,
            };
        case USER_LOGIN_FALIURE:
            console.log("payload", payload);
            console.log("error", payload?.response?.data?.message);
            doSignOut(payload?.response?.data?.message);

            return {
                ...state,
                userLoggedIn: false,
                error: payload?.response?.data?.message,
            };
        case USER_LOGOUT:
            return {
                ...initialState,
            };
        case USER_ID_STORE:
            return {
                ...state,
                userId: payload
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
                error: payload?.response?.data,
            };
        case SET_USER_PROFILE:
            return {
                ...state,
                userProfile: payload,
            };
        case SET_PROFILE_SUCCESS:
            return {
                ...state,
                userProfile: payload,
            };
        case SET_PROFILE_FAILURE:
            return {
                ...state,
                error: payload?.response?.data,
            };
        default:
            return state;
    }
};

export default userReducer;
