import {
    GET_MEALPLAN_SUCCESS,
    GET_MEALPLAN_FAILURE,
    SET_MEALPLAN_SUCCESS,
    SET_MEALPLAN_FAILURE,
    SET_MEAL_TRIGGER,
    MEAL_DELETE_SUCCESS,
    MEAL_DELETE_FAILURE,
} from "./mealPlanActionTypes";

const initialState = {
    loading: false,
    data: [],
    deleteSuccess: {},
    error: "",
    status: "",
    code: "",
};

export const mealPlanReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case SET_MEAL_TRIGGER:
            return {
                ...state,
                data: [],
                error: "",
                status: "",
                code: "",
            };
        case GET_MEALPLAN_SUCCESS:
            return {
                ...state,
                data: payload,
                error: "",
                status: "OK",
                code: "",
            };
        case GET_MEALPLAN_FAILURE:
            return {
                ...state,
                error: payload?.response?.data?.message,
                code: payload?.response?.status,
            };
        case SET_MEALPLAN_SUCCESS:
            return {
                ...state,
                data: payload,
                error: "",
                status: "OK",
                code: "",

            };
        case SET_MEALPLAN_FAILURE:
            return {
                ...state,
                error: payload?.response?.data?.message,
                code: payload?.response?.status,
            };
        case MEAL_DELETE_SUCCESS:
            return {
                ...state,
                deleteSuccess: payload,
                error: "",
                status: "OK",
                code: "",

            };
        case MEAL_DELETE_FAILURE:
            return {
                ...state,
                error: payload?.response?.data?.message,
                code: payload?.response?.status,
            };
        default:
            return state;
    }
};

export default mealPlanReducer;
