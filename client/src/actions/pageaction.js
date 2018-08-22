import {
  PAGES_LOADING,
  GET_PAGES,
  ADD_TO_POSTARRAY,
  ADD_ALL_TO_POSTARRAY
} from "./types";

export const getpages = pages => {
  return {
    type: GET_PAGES,
    payload: pages
  };
};
export const groupPost = set => {
  return {
    type: ADD_TO_POSTARRAY,
    payload: set
  };
};
export const groupPostToAll = pages => {
  return {
    type: ADD_ALL_TO_POSTARRAY,
    payload: pages
  };
};
export const setpageloading = () => {
  return { type: PAGES_LOADING };
};
