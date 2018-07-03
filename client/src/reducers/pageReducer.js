import {
  ADD_PAGE,
  PAGES_LOADING,
  GET_PAGE,
  GET_PAGES,
  DELETE_PAGE
} from "../actions/types";
const initialState = {
  pages: [],
  page: {},
  loading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_PAGE:
      return {
        ...state,
        pages: [action.payload, ...state.pages],
        loading: false
      };
    case PAGES_LOADING:
      return { ...state, loading: true };
    case GET_PAGES:
      return { ...state, pages: action.payload, loading: false };
    case DELETE_PAGE:
      return {
        ...state,
        pages: state.pages.filter(page => page._id !== action.payload)
      };
    case GET_PAGE: {
      return { ...state, page: action.payload, loading: false };
    }

    default:
      return state;
  }
};
