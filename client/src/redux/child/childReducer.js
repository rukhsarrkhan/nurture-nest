// import { v4 as uuid } from "uuid";
import { ADD_CHILD, ADD_CHILD_SUCCESS, ADD_CHILD_FAILURE, FETCH_CHILDREN_FAILURE, FETCH_CHILDREN_SUCCESS } from "./childActionTypes";

const initialState = {
    loading: false,
    data: {},
    error: "",
    status: "",
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
            };
        case ADD_CHILD_SUCCESS:
            return {
                ...state,
                childObjs: [...state.childObjs, payload],
            };
        case ADD_CHILD_FAILURE:
            return {
                ...state,
                error: payload.response.data,
            };
        case FETCH_CHILDREN_SUCCESS:
            return {
                ...state,
                childObjs: payload,
            };
        case FETCH_CHILDREN_FAILURE:
            return {
                ...state,
                error: payload.response.data,
            };

        default:
            return state;
    }
};

export default childReducer;
