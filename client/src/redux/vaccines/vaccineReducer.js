import {
 VACCINE_ADD_SUCCESS,
 VACCINE_ADD_FALIURE 
} from "./vaccineActionTypes"

const initialState = {
    vaccineAdded: false,
    data: {},
    error: "",
    status: "",
  };

  export const vaccineReducer = (state = initialState, action) => {
    const { type, payload } = action;
 console.log(action)
  switch (type) {
    case VACCINE_ADD_SUCCESS:
      return {
        ...state,
        vaccineAdded: true,
        data: payload,
        error: "",
        status: "OK",
      };
    case  VACCINE_ADD_FALIURE :
      return {
        ...state,
        vaccineAdded : false,
        error: payload.response.data,
      };
    default:
      return state;
  }
  }
  export default vaccineReducer;