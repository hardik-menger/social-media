export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("auth");
    if (serializedState === null) {
      return { appAuth: false, twitterData: false, isAuthenticated: false };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { appAuth: false, twitterData: false, isAuthenticated: false };
  }
};

export const saveState = state => {
  try {
    const serializedState = localStorage.getItem("auth");
    localStorage.setItem("auth", serializedState);
  } catch {
    // ignore write errors
  }
};
