import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  loginuser,
  logout,
  loginfb,
  logoutfb,
  logintwitter,
  logouttwitter,
  setCurrentUser
} from "../../actions/authaction";
import loadFbLoginApi from "../../FB/loadsdk";
import "../../App.css";
import axios from "axios";
class Navbar extends Component {
  constructor(props) {
    super(props);
    let auth =
      localStorage.getItem("auth") === null
        ? {}
        : JSON.parse(localStorage.getItem("auth"));
    if (Object.keys(auth).length === 0) {
      // props.logintwitter(auth.twitter);
      // props.loginfb(!!!auth.appData ? {} : auth.appData);
    } else {
      props.logintwitter(auth.twitter);
      props.loginfb(!!!auth.appData ? {} : auth.appData);
    }
    if (localStorage.getItem("auth")) {
      props.loginuser(JSON.parse(localStorage.getItem("auth")));
    }
    this.state = { auth: {} };
  }
  onfblogout = () => {
    window.FB.logout(response => {
      console.log(response);
    });
    this.props.logoutfb();
  };
  componentDidMount() {
    window.addEventListener("message", this.handleFrameTasks);
    loadFbLoginApi();
  }
  componentWillUnmount() {
    window.removeEventListener("message", this.handleFrameTasks);
  }
  handleFrameTasks = e => {
    if (
      e.origin !== "https://platform.twitter.com" &&
      e.origin !== "https://staticxx.facebook.com" &&
      e.origin !== "http://localhost:3000" &&
      e.origin !== "https://riidlfbproject.herokuapp.com/"
    ) {
      console.log(e.origin);
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.twitter = { ...e.data };
      this.setState({ auth });
      this.props.logintwitter(e.data);
    }
  };
  checkLoginState() {
    window.FB.getLoginStatus(
      function(response) {
        if (response.status === "connected") {
          this.props.loginuser(response);
        } else {
          alert("Login Unsuccessfull");
        }
      }.bind(this)
    );
  }

  handleFBLogin = () => {
    window.FB.login(
      response => {
        if (response.authResponse) {
          this.props.loginfb(response);
        }
      },
      {
        scope: "pages_manage_cta,pages_show_list,publish_pages,manage_pages",
        return_scopes: true,
        enable_profile_selector: true
      }
    );
  };
  onlogout = e => {
    e.preventDefault();
    localStorage.removeItem("auth");
    this.props.logout();
  };
  win = {};
  twitterLogin = () => {
    fetch(`/api/twitter/request-token`)
      .then(res => {
        res.json().then(url => {
          this.win = window.open(
            url.url,
            "_blank",
            "toolbar=yes,scrollbars=yes,resizable=yes,left=500,width=400,height=400"
          );
        });
      })
      .catch(err => console.log(err));
  };
  twitterLogout = () => {
    let auth = JSON.parse(localStorage.getItem("auth"));
    delete auth.twitter;
    localStorage.setItem("auth", JSON.stringify(auth));
    this.setState({ auth });
    this.props.logouttwitter();
  };
  saveTwitterToken = () => {
    axios
      .post("/api/twitter/save-token", {
        useremail: this.props.auth.user.email,
        twitterid: this.props.auth.twitter.id,
        twitterauth: {
          username: this.props.auth.twitter.screen_name,
          type: "twitter",
          secret: this.props.auth.twitter.accessSecret,
          token: this.props.auth.twitter.accessToken,
          profile_image_url: this.props.auth.twitter.profile_image_url,
          accountid: this.props.auth.twitter.id
        }
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    const modalDialog = {
      height: "30vh",
      margin: "0px auto",
      padding: "0px",
      verticalAlign: "middle"
    };

    const modalContent = {
      height: "auto",
      minHeight: "100%",
      borderRadius: "0",
      width: "100%",
      margin: "0px"
    };
    if (this.props.auth.twitterAuth) this.saveTwitterToken();
    let appAuth, socialAuth, twitterAuth;
    if (!localStorage.getItem("auth") == null) appAuth = false;
    if (localStorage.getItem("auth") != null) {
      JSON.parse(localStorage.getItem("auth")).appAuth
        ? (appAuth = true)
        : (appAuth = false);
      JSON.parse(localStorage.getItem("auth")).isAuthenticated
        ? (socialAuth = true)
        : (socialAuth = false);
      this.props.auth.twitterAuth
        ? (twitterAuth = true)
        : (twitterAuth = false);
    } else {
      appAuth = false;
      socialAuth = false;
    }
    const authlinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link to="/register" className="nav-link ">
            Register
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link " to="/login">
            Login <i className="fas fa-sign-in-alt" />
          </Link>
        </li>
      </ul>
    );
    const profileActions = (
      <ul className="navbar-nav ">
        <li
          className="nav-item"
          style={{ display: appAuth ? "list-item" : "none" }}
        >
          <Link className="nav-link" to="/profiles">
            Add Profiles
          </Link>
        </li>
        <li
          className="nav-item"
          style={{
            display:
              appAuth || this.props.auth.twitterAuth ? "list-item" : "none"
          }}
        >
          <Link className="nav-link" to="/pages">
            Profiles
          </Link>
        </li>
      </ul>
    );
    const loggedLinks = (
      <div className="d-flex justify-content-between" style={{ width: "100%" }}>
        {socialAuth ? profileActions : null}
        <ul className={socialAuth ? "navbar-nav" : "navbar-nav ml-auto"}>
          <li className="nav-item">
            <Link
              to="/"
              className="nav-link "
              data-toggle="modal"
              data-target="#addProfile"
            >
              <span>Add Social Logins</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              onClick={this.onlogout.bind(this)}
              to="/login"
            >
              Logout
            </Link>
          </li>
        </ul>
      </div>
    );
    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Social
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            {this.props.auth.appAuth || this.props.auth.isAuthenticated
              ? loggedLinks
              : authlinks}
            <div
              className="modal fade nopadding loginboard"
              id="addProfile"
              role="dialog"
              aria-labelledby="addProfileLabel"
              aria-hidden="true"
              style={{
                maxWidth: "100%"
              }}
            >
              <div className="modal-dialog" style={modalDialog}>
                <div className="modal-content" style={modalContent}>
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLongTitle">
                      Add profiles
                    </h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                      id="close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    {this.props.auth.appAuth ? (
                      <button
                        className="btn btn-block btn-social btn-facebook"
                        onClick={this.onfblogout}
                      >
                        <span className="fab fa-facebook" />
                        <span> Logout from Facebook</span>
                      </button>
                    ) : (
                      <button
                        className="btn btn-block btn-social btn-facebook"
                        onClick={this.handleFBLogin}
                      >
                        <span className="fab fa-facebook" />
                        <span> Login with Facebook</span>
                      </button>
                    )}
                    <button className="btn btn-block btn-social btn-instagram">
                      <i className="fab fa-instagram" /> Log in with Instagram
                    </button>
                    {!this.props.auth.twitterAuth ? (
                      <button
                        className="btn btn-block btn-social btn-twitter"
                        onClick={this.twitterLogin}
                      >
                        <i className="fab fa-twitter" /> Log in with Twitter
                      </button>
                    ) : (
                      <button
                        className="btn btn-block btn-social btn-twitter"
                        onClick={this.twitterLogout}
                      >
                        <i className="fab fa-twitter" /> Logout from Twitter
                      </button>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-default closeconform"
                      data-dismiss="modal"
                      id="signin"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
const mapStateToProps = state => {
  return { auth: state.auth };
};
export default connect(
  mapStateToProps,
  {
    loginuser,
    logout,
    loginfb,
    logoutfb,
    logintwitter,
    logouttwitter,
    setCurrentUser
  }
)(Navbar);
