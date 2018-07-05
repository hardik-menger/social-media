import { PAGES_LOADING, GET_PAGES, ADD_TO_POSTARRAY } from "./types";

export const getpages = pages => {
  return {
    type: GET_PAGES,
    payload: pages.data
  };
};
export const groupPost = set => {
  return {
    type: ADD_TO_POSTARRAY,
    payload: set
  };
};
export const getpost = id => dispatch => {};
export const deletepost = id => dispatch => {};
export const addlike = id => dispatch => {};
export const setpageloading = () => {
  return { type: PAGES_LOADING };
};
