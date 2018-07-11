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
import PrivacyPolicy from "./components/layout/privacy-policy";
import Terms from "./components/layout/terms";
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <Router>
            <div>
              <Navbar />
              <div className="container">
                <Switch>
                  {" "}
                  <PrivateRoute exact path="/pages" component={Page} />
                </Switch>
                <Switch>
                  {" "}
                  <PrivateRoute
                    exact
                    path="/page/:pageid/:accesstoken"
                    component={PostForm}
                  />
                </Switch>
                <Route exact path="/" component={Landing} />
                <Route exact path="/privacy-policy" component={PrivacyPolicy} />
                <Route exact path="/terms-of-service" component={Terms} />
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
