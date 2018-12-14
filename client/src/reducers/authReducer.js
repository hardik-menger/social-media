import {
  SET_CURRENT_USER,
  SET_APP_AUTH,
  REMOVE_USER,
  FACEBOOK_LOGOUT,
  FACEBOOK_LOGIN,
  ADD_TWITTER_AUTH,
  REMOVE_TWITTER_AUTH,
  TWITTER_ADD
} from "../actions/types";
import isEmpty from "../utils/validation";
const initialState = {
  isAuthenticated: false,
  user: {},
  appAuth: false,
  appData: {},
  twitter: { add: false },
  twitterAuth: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
        appAuth: false,
        twitterAuth: false
      };
    case REMOVE_USER:
      return { appData: false, isAuthenticated: false };
    case SET_APP_AUTH:
      return {
        ...state,
        appAuth: !isEmpty(action.payload),
        appData: action.payload
      };
    case FACEBOOK_LOGIN:
      return {
        ...state,
        appAuth: !isEmpty(action.payload),
        appData: action.payload
      };
    case FACEBOOK_LOGOUT:
      return {
        ...state,
        appAuth: false,
        appData: {}
      };

    case ADD_TWITTER_AUTH: {
      return {
        ...state,
        twitter: { ...action.payload, add: !!action.payload.add },
        twitterAuth: !isEmpty(action.payload)
      };
    }
    case REMOVE_TWITTER_AUTH: {
      return {
        ...state,
        twitter: { add: false },
        twitterAuth: !isEmpty(action.payload)
      };
    }
    case TWITTER_ADD: {
      return {
        ...state,
        twitter: { ...state.twitter, add: action.payload }
      };
    }
    default:
      return state;
  }
};
