import {
  GET_ERRORS,
  SET_CURRENT_USER,
  REMOVE_USER,
  ADD_TWITTER_AUTH,
  REMOVE_TWITTER_AUTH,
  FACEBOOK_LOGIN,
  TWITTER_ADD
} from "./types";
import isEmpty from "../utils/validation";
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
      const user = { ...decoded, token };
      localStorage.setItem(
        "auth",
        JSON.stringify({ user, isAuthenticated: true })
      );
      //set current user
      return dispatch({
        type: SET_CURRENT_USER,
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
export const logoutfb = () => {
  let auth = JSON.parse(localStorage.auth);
  auth.appAuth = false;
  auth.appData = {};
  localStorage.setItem("auth", JSON.stringify(auth));
  return { type: FACEBOOK_LOGIN, payload: {} };
};
export const loginfb = user => {
  let auth = JSON.parse(localStorage.auth);
  auth.appAuth = !isEmpty(user);
  auth.appData = user;
  localStorage.setItem("auth", JSON.stringify(auth));
  return { type: FACEBOOK_LOGIN, payload: user };
};
export const logintwitter = twitterAuth => {
  let auth = JSON.parse(localStorage.auth);
  auth.twitterAuth = true;
  auth.twitter = { ...twitterAuth };
  localStorage.setItem("auth", JSON.stringify(auth));
  return { type: ADD_TWITTER_AUTH, payload: twitterAuth };
};
export const logouttwitter = () => {
  let auth = JSON.parse(localStorage.getItem("auth"));
  auth.twitter = {};
  auth.twitterAuth = false;
  localStorage.setItem("auth", JSON.stringify(auth));
  return { type: REMOVE_TWITTER_AUTH };
};
export const addTwitterToArray = add => {
  return { type: TWITTER_ADD, payload: add };
};
