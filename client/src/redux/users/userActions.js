import axios from "axios";
import socketIO from "socket.io-client";

import {
    USER_LOGOUT,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FALIURE,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FALIURE,
    SET_PROFILE_FAILURE,
    SET_PROFILE_SUCCESS,
    USER_ID_STORE,
    USER_INITIATE,
} from "./userActionTypes";
// const socket = socketIO.connect('http://localhost:3000');

export const userInitiate = () => {
    return {
        type: USER_INITIATE,
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
export const setProfileSuccess = (userObj) => {
    return {
        type: SET_PROFILE_SUCCESS,
        payload: userObj,
    };
};

export const setProfileFailure = (error) => {
    return {
        type: SET_PROFILE_FAILURE,
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

export const userIdStore = (id) => {
    return {
        type: USER_ID_STORE,
        payload: id,
    };
};

export const userRegistrationAPICall = (obj) => {
    return async (dispatch) => {
        try {
            dispatch(userInitiate());

            dispatch(userIdStore(obj.uuid));
            let resp = await axios.post("http://localhost:3000/users/signup", obj);
            dispatch(userRegisterSuccess(resp?.data));
            dispatch(setProfileSuccess(resp?.data));
        } catch (error) {
            dispatch(userRegisterFailure(error));
        }
    };
};

export const userLoginAPICall = (uuId, email, firstName, lastName) => {
    return async (dispatch) => {
        try {
            dispatch(userInitiate());
            let obj = {
                email: email,
                firstName: firstName,
                lastName: lastName,
            };
            let resp = await axios.post(`http://localhost:3000/users/signin/${uuId}`, obj);
            dispatch(userLoginSuccess(resp?.data));
            dispatch(setProfileSuccess(resp?.data));
        } catch (error) {
            dispatch(userLoginFailure(error));
        }
    };
};

export const setUserProfileAPICall = (id) => {
    return async (dispatch) => {
        try {
            let { data } = await axios.get(`http://localhost:3000/users/${id}`);
            dispatch(setProfileSuccess(data));
        } catch (error) {
            dispatch(setProfileFailure(error));
        }
    };
};

export const updateUserAPICall = (id, obj) => {
    return async (dispatch) => {
        try {
            let { data } = await axios.patch(`http://localhost:3000/users/${id}`, obj);
            dispatch(setProfileSuccess(data));
        } catch (error) {
            dispatch(setProfileFailure(error));
        }
    };
};
export const updateProfileImageAPICall = (id, formData) => {
    return async (dispatch) => {
        try {
            let { data } = await axios.put(`http://localhost:3000/users/image/${id}`, formData);
            dispatch(setProfileSuccess(data));
        } catch (error) {
            dispatch(setProfileFailure(error));
        }
    };
};

export const userLogoutCall = (obj) => {
    return async (dispatch) => {
        dispatch(userLogout());
        localStorage.clear();
    };
};
