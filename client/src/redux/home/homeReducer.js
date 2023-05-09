import { GET_HOME_FAILURE, GET_HOME_SUCCESS } from "./homeActionTypes";

const initialState = {
    loading: false,
    data: {},
    error: "",
    code: "",
    status: "",
};

export const homeReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case GET_HOME_SUCCESS:
            return {
                ...state,
                data: payload,
                error: "",
                status: "OK",
            };

        case GET_HOME_FAILURE:
            return {
                ...state,
                error: payload?.response?.data?.message,
                code: payload?.response?.status,
            };
        default:
            return state;
    }
};

export default homeReducer;
