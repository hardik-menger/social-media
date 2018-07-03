import { GET_ERRORS, SET_CURRENT_USER } from "./types";
export const loginuser = userdata => {
  if (userdata.status === "connected") {
    localStorage.setItem("auth", JSON.stringify(userdata));

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
export const setCurrentUser = user => {
  return {
    type: SET_CURRENT_USER,
    payload: user
  };
};

export const logout = () => {
  localStorage.removeItem("auth");
  return setCurrentUser({});
};
