import {
    ADD_CHILD,
    ADD_CHILD_SUCCESS,
    ADD_CHILD_FAILURE,
    FETCH_CHILDREN_FAILURE,
    FETCH_CHILDREN_SUCCESS,
    DELETE_CHILD_SUCCESS,
    DELETE_CHILD_FAILURE,
} from "./childActionTypes";

const initialState = {
    loading: false,
    data: {},
    error: "",
    status: "",
    code: "",
    childObjs: [],
};

export const childReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case ADD_CHILD:
            return {
                ...state,
                data: payload,
                status: "OK",
                error: "",
                code: "",
            };
        case ADD_CHILD_SUCCESS:
            return {
                ...state,
                childObjs: [...state.childObjs, payload],
                status: "OK",
                error: "",
                code: "",
            };
        case ADD_CHILD_FAILURE:
            return {
                ...state,
                error: payload?.response?.data?.message,
                code: payload?.response?.status,
            };
        case FETCH_CHILDREN_SUCCESS:
            return {
                ...state,
                childObjs: payload,
                status: "OK",
                error: "",
                code: "",
            };
        case FETCH_CHILDREN_FAILURE:
            return {
                ...state,
                error: payload?.response?.data?.message,
                code: payload?.response?.status,
            };
        case DELETE_CHILD_SUCCESS:
            return {
                ...state,
                childObjs: state.childObjs.filter((child) => child._id !== payload._id),
                status: "OK",
                error: "",
                code: "",
            };
        case DELETE_CHILD_FAILURE:
            return {
                ...state,
                error: payload?.response?.data?.message,
                code: payload?.response?.status,
            };
        default:
            return state;
    }
};

export default childReducer;
