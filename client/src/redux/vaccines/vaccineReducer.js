import {
    GET_VACCINE_SUCCESS,
    GET_VACCINE_FAILURE,
    SET_VACCINE_SUCCESS,
    SET_VACCINE_FAILURE,
    SET_VACCINE_TRIGGER,
    VACCINE_DELETE_SUCCESS,
    VACCINE_DELETE_FAILURE,
} from "./vaccineActionTypes";

const initialState = {
    loading: false,
    data: [],
    deleteSuccess: {},
    error: "",
    status: "",
    code: "",
};

export const vaccineReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case SET_VACCINE_TRIGGER:
            return {
                ...state,
                data: [],
                error: "",
                status: "",
                code: "",
            };
        case GET_VACCINE_SUCCESS:
            return {
                ...state,
                data: payload,
                error: "",
                status: "OK",
                code: "",

            };
        case GET_VACCINE_FAILURE:
            return {
                ...state,
                error: payload?.response?.data?.message,
                code: payload?.response?.status,
            };
        case SET_VACCINE_SUCCESS:
            return {
                ...state,
                data: payload,
                error: "",
                status: "OK",
                code: "",

            };
        case SET_VACCINE_FAILURE:
            return {
                ...state,
                error: payload?.response?.data?.message,
                code: payload?.response?.status,
            };
        case VACCINE_DELETE_SUCCESS:
            return {
                ...state,
                deleteSuccess: payload,
                error: "",
                status: "OK",
                code: "",

            };
        case VACCINE_DELETE_FAILURE:
            return {
                ...state,
                error: payload?.response?.data?.message,
                code: payload?.response?.status,
            };
        default:
            return state;
    }
};

export default vaccineReducer;
