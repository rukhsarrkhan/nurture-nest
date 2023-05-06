import axios from "axios";
import { ADD_CHILD, ADD_CHILD_SUCCESS, ADD_CHILD_FAILURE } from "./childActionTypes";

export const setChildSuccess = (userObj) => {
    return {
        type: ADD_CHILD_SUCCESS,
        payload: userObj,
    };
};

export const setChildFailure = (error) => {
    return {
        type: ADD_CHILD_FAILURE,
        payload: error,
    };
};

export const createChildAPICall = (obj) => {
    return async (dispatch) => {
        try {
            let { data } = await axios.post(`http://localhost:3000/child`, obj);
            dispatch(setChildSuccess(data));
        } catch (error) {
            dispatch(setChildFailure(error));
        }
    };
};
