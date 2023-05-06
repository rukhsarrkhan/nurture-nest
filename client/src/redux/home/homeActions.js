import { GET_HOME_SUCCESS, GET_HOME_FAILURE } from "./homeActionTypes";
import axios from "axios";

export const gethomeSuccess = (obj) => {
    return {
        type: GET_HOME_SUCCESS,
        payload: obj,
    };
};

export const gethomeFailure = (error) => {
    return {
        type: GET_HOME_FAILURE,
        payload: error,
    };
};

export const gethomeAPICall = (id) => {
    return async (dispatch) => {
        try {
            let resp = await axios.get(`http://localhost:3000/users/${id}`);
            dispatch(gethomeSuccess(resp?.data));
        } catch (error) {
            dispatch(gethomeFailure(error));
        }
    };
};
