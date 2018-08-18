import { SET_CURRENT_USER, SET_APP_AUTH, REMOVE_USER } from "../actions/types";
import isEmpty from "../utils/validation";
const initialState = {
  isAuthenticated: false,
  user: {},
  appAuth: false,
  appData: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case REMOVE_USER:
      return {};
    case SET_APP_AUTH:
      return {
        ...state,
        appAuth: !isEmpty(action.payload),
        appData: action.payload
      };
    default:
      return state;
  }
};
