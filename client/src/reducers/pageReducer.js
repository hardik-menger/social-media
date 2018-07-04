import {
  ADD_PAGE,
  PAGES_LOADING,
  GET_PAGE,
  GET_PAGES,
  DELETE_PAGE,
  ADD_TO_POSTARRAY,
  REMOVE_FROM_POSTARRAY
} from "../actions/types";
import _ from "lodash";
const initialState = {
  pages: [],
  pageArray: [],
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
    case ADD_TO_POSTARRAY: {
      //delete problem
      let added = _.uniqBy([...state.pageArray, action.payload], "id");
      added = _.remove(
        added,
        obj => parseInt(obj.id) === parseInt(action.payload.id)
      );
      console.log(added, action.payload.id);
      return { ...state, pageArray: added };
    }
    default:
      return state;
  }
};
