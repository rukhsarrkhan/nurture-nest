import axios from "axios";
import {
    USER_LOGOUT,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FALIURE,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FALIURE,
    SET_PROFILE_FAILURE,
    SET_PROFILE_SUCCESS,
    USER_ID_STORE,
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
            dispatch(userIdStore(obj.uuid));
            let resp = await axios.post("http://localhost:3000/users/signup", obj);
            dispatch(userRegisterSuccess(resp?.data));
            localStorage.setItem("userData", JSON.stringify(resp.data));
        } catch (error) {
            dispatch(userRegisterFailure(error));
        }
    };
};

export const userLoginAPICall = (uuId) => {
    return async (dispatch) => {
        try {
            let resp = await axios.post(`http://localhost:3000/users/signin/${uuId}`);
            localStorage.setItem("userData", JSON.stringify(resp.data));
            dispatch(userLoginSuccess(resp?.data));
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

export const userLogoutCall = (obj) => {
    return async (dispatch) => {
        dispatch(userLogout());
        // remove token here
        localStorage.removeItem("userData");
    };
};
