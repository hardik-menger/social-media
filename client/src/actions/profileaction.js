import axios from "axios";
import {
  GET_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  SET_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER,
  GET_PROFILES
} from "./types";

//get current profile
export const getcurrentprofile = () => dispatch => {
  dispatch(setprofileloading());
  axios
    .get("/api/profile")
    .then(res => {
      return dispatch({ type: GET_PROFILE, payload: res.data });
    })
    .catch(err => {
      dispatch({
        type: GET_PROFILE,
        payload: {}
      });
    });
};
//loading profile
export const setprofileloading = () => {
  return {
    type: PROFILE_LOADING
  };
};
//clear profile
export const clearcurrentprofile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};
//set profile
export const createProfile = (data, history) => dispatch => {
  axios
    .post("/api/profile", data)
    .then(profile => {
      history.push("/dashboard");
      return dispatch({ type: SET_PROFILE, payload: profile.data });
    })
    .catch(err => {
      return dispatch({ type: GET_ERRORS, payload: err.response.data });
    });
};
export const deleteaccount = () => dispatch => {
  if (window.confirm("Are you sure? this can not be undone..")) {
    axios
      .delete("/api/profile")
      .then(res =>
        dispatch({
          type: SET_CURRENT_USER,
          payload: {}
        })
      )
      .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
  }
};
//add experience
export const addExperience = (expdata, history) => dispatch => {
  axios
    .post("/api/profile/experience", expdata)
    .then(res => history.push("/dashboard"))
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};
//add education
export const addEducation = (edudata, history) => dispatch => {
  axios
    .post("/api/profile/education", edudata)
    .then(res => history.push("/dashboard"))
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};
//delete experience
export const deleteExperience = id => dispatch => {
  axios
    .delete("/api/profile/experience/" + id)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};
//delete education
export const deleteEducation = id => dispatch => {
  axios
    .delete("/api/profile/education/" + id)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};
//get profiles
export const getprofiles = () => dispatch => {
  dispatch(setprofileloading());
  axios
    .get("/api/profile/all")
    .then(res => dispatch({ type: GET_PROFILES, payload: res.data }))
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};
//get prof by handle
export const getProfileByHandle = handle => dispatch => {
  dispatch(setprofileloading());
  axios
    .get(`/api/profile/handle/${handle}`)
    .then(res => dispatch({ type: GET_PROFILE, payload: res.data }))
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};
