import axios from "axios";
import {
  ADD_PAGE,
  PAGES_LOADING,
  GET_PAGE,
  GET_PAGES,
  DELETE_PAGE
} from "./types";

export const getpages = pages => {
  return {
    type: GET_PAGES,
    payload: pages.data
  };
};
export const getpost = id => dispatch => {};
export const deletepost = id => dispatch => {};
export const addlike = id => dispatch => {};
export const setpageloading = () => {
  return { type: PAGES_LOADING };
};
