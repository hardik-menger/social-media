import {
  ADD_PAGE,
  PAGES_LOADING,
  GET_PAGE,
  GET_PAGES,
  DELETE_PAGE,
  ADD_TO_POSTARRAY,
  ADD_TO_TWITTER,
  ADD_ALL_TO_POSTARRAY
} from "../actions/types";
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
      return { ...state, pages: action.payload, loading: false, pageArray: [] };
    case DELETE_PAGE:
      return {
        ...state,
        pages: state.pages.filter(page => page._id !== action.payload)
      };
    case GET_PAGE: {
      return { ...state, page: action.payload, loading: false };
    }
    case ADD_TO_POSTARRAY: {
      var uniq = new Set(
        [...state.pageArray, action.payload].map(e => JSON.stringify(e))
      );
      var added = Array.from(uniq).map(e => JSON.parse(e));
      if ([...state.pageArray, action.payload].length - uniq.size === 1) {
        var removeIndex = added
          .map(function(item) {
            return item.id;
          })
          .indexOf(action.payload.id);

        // remove object
        added.splice(removeIndex, 1);
      }
      return { ...state, pageArray: added };
    }
    case ADD_ALL_TO_POSTARRAY: {
      return { ...state, pageArray: [...action.payload] };
    }
    default:
      return state;
  }
};
