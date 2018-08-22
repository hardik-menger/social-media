import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Page from "./components/PageComponent";
import Landing from "./components/Landing";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { Provider } from "react-redux";
import store from "./store";
import PostForm from "./components/forms/PostForm";
import PrivateRoute from "./components/common/PrivateRoute";
import PostComponent from "./components/Posts/PostComponent";
import jwt_decode from "jwt-decode";
import setAuthtoken from "./utils/setauthtoken";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import { logout, setCurrentUser } from "./actions/authaction";
import Profiles from "./components/Profiles/profiles";
if (localStorage.jwttoken) {
  setAuthtoken(localStorage.jwttoken);
  const user = jwt_decode(localStorage.jwttoken);
  store.dispatch(setCurrentUser(user));
  //check for expired token
  const currenttime = Date.now() / 1000;
  if (user.exp < currenttime) {
    //logout
    store.dispatch(logout());
    window.location.href = "/login";
  }
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <Router>
            <div>
              <Navbar />
              <div className="container" style={{ minHeight: "50vh" }}>
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Switch>
                  <PrivateRoute exact path="/pages" component={Page} />
                </Switch>
                <Switch>
                  <PrivateRoute exact path="/profiles" component={Profiles} />
                </Switch>
                <Switch>
                  <PrivateRoute exact path="/post" component={PostForm} />
                </Switch>
                <Switch>
                  <PrivateRoute
                    exact
                    path="/posts/:pageid/:token"
                    component={PostComponent}
                  />
                </Switch>{" "}
                <Route exact path="/" component={Landing} />
              </div>
              <Footer />
            </div>
          </Router>
        </div>
      </Provider>
    );
  }
}

export default App;
