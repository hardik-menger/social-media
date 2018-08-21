import {
  GET_ERRORS,
  SET_CURRENT_USER,
  SET_APP_AUTH,
  REMOVE_USER
} from "./types";
import axios from "axios";
import setAuthtoken from "../utils/setauthtoken";
import jwt_decode from "jwt-decode";
//register user
export const registeruser = (userdata, history) => dispatch => {
  axios
    .post("http://localhost:3001/api/users/register", userdata)
    .then(res => {
      history.push("/login");
    })
    .catch(err => {
      return dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
export const loginuser = userdata => {
  if (userdata.status === "connected") {
    const auth = JSON.parse(localStorage.auth);
    localStorage.setItem(
      "auth",
      JSON.stringify({
        appData: auth,
        user: userdata,
        isAuthenticated: true,
        appAuth: true
      })
    );

    return {
      type: SET_CURRENT_USER,
      payload: userdata
    };
  } else {
    return {
      type: GET_ERRORS,
      payload: "Not Connected"
    };
  }
};
export const loginapp = userdata => dispatch => {
  axios
    .post("http://localhost:3001/api/users/login", userdata)
    .then(res => {
      //save token localstorage
      const { token } = res.data;
      //set to locastorage
      localStorage.setItem("jwttoken", token);
      //set token to authheader
      setAuthtoken(token);
      //decode bearer thing
      const decoded = jwt_decode(token);
      const appData = { ...decoded, token };
      localStorage.setItem("auth", JSON.stringify({ appData, appAuth: true }));
      //set current user
      return dispatch({
        type: SET_APP_AUTH,
        payload: { ...decoded, token }
      });
    })
    .catch(err => {
      return dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
export const setCurrentUser = user => {
  return {
    type: SET_CURRENT_USER,
    payload: user
  };
};

export const logout = () => {
  localStorage.removeItem("auth");
  localStorage.removeItem("jwttoken");
  return {
    type: REMOVE_USER
  };
};
export const logoutfb = () => dispatch => {
  let auth = JSON.parse(localStorage.auth);
  auth.isAuthenticated = false;
  delete auth.authResponse;
  delete auth.status;
  localStorage.setItem("auth", JSON.stringify(auth));
  return dispatch(setCurrentUser({}));
};
