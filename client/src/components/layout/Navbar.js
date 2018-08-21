import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loginuser, logout, logoutfb } from "../../actions/authaction";
import loadFbLoginApi from "../../FB/loadsdk";
import "../../App.css";
class Navbar extends Component {
  constructor(props) {
    super(props);

    if (localStorage.getItem("auth")) {
      props.loginuser(JSON.parse(localStorage.getItem("auth")));
    }
  }
  fbLogoutUser = () => {
    window.FB.getLoginStatus(function(response) {
      if (response && response.status === "connected") {
        window.FB.logout(function(response) {
          console.log(response, "on logout");
        });
      }
    });
  };
  onfblogout = () => {
    window.FB.logout(response => {
      console.log(response);
    });
    this.props.logoutfb();
  };

  componentDidMount() {
    loadFbLoginApi();
  }

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
          this.props.loginuser(response);
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
    console.log("test");
    localStorage.removeItem("auth");
    this.props.logout();
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
    const { appAuth } = this.props.auth;
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
    const loggedLinks = (
      <ul className="navbar-nav ml-auto">
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
            <ul className="navbar-nav mr-auto">
              <li
                className="nav-item"
                style={{ display: appAuth ? "list-item" : "none" }}
              >
                <Link className="nav-link" to="/pages">
                  Add Profiles
                </Link>
              </li>
              <li
                className="nav-item"
                style={{ display: appAuth ? "list-item" : "none" }}
              >
                <Link className="nav-link" to="/pages">
                  Profiles
                </Link>
              </li>
            </ul>
            {appAuth ? loggedLinks : authlinks}
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
                    {this.props.auth.isAuthenticated ? (
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
                      <i className="fab fa-instagram" /> Sign in with Instagram
                    </button>
                    <button className="btn btn-block btn-social btn-twitter">
                      <i className="fab fa-twitter" /> Sign in with Twitter
                    </button>
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
  { loginuser, logout, logoutfb }
)(Navbar);
