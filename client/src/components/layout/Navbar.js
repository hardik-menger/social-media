import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loginuser, logout } from "../../actions/authaction";
import loadFbLoginApi from "../../FB/loadsdk";
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
  onlogout = () => {
    window.FB.logout(response => {
      console.log(response);
    });
    localStorage.removeItem("auth");
    this.props.logout();
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
          console.log(response);
          this.props.loginuser(response);
        }
      },
      {
        scope: "pages_manage_cta,pages_show_list,publish_pages,manage_pages",
        // "pages_manage_cta,pages_show_list,publish_pages,manage_pages,publish_actions",
        return_scopes: true,
        enable_profile_selector: true
      }
    );
  };

  render() {
    const authlinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link to="/" className="nav-link" onClick={this.onlogout}>
            Logout
          </Link>
        </li>
      </ul>
    );
    const guestlinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link to="/" className="nav-link" onClick={this.handleFBLogin}>
            Login
          </Link>
        </li>
      </ul>
    );
    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
        <div className="container">
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
              <li className="nav-item">
                <Link className="nav-link" to="/pages">
                  {" "}
                  Pages
                </Link>
              </li>
            </ul>
            {this.props.auth.isAuthenticated ? authlinks : guestlinks}
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
  { loginuser, logout }
)(Navbar);
