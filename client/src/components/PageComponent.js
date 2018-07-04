import React, { Component } from "react";
import { connect } from "react-redux";
import { getpages, setpageloading } from "../actions/pageaction";
import { loginuser } from "../actions/authaction";
import SinglePost from "./SinglePost";
class PageComponent extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.statusChangeCallback();
    } else {
      alert("Please log in");
    }
  }
  async statusChangeCallback() {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const { accessToken } = auth.authResponse;
    const { status } = auth;
    if (status === "connected") {
      this.props.setpageloading();
      await fetch(
        `https://graph.facebook.com/v3.0/me/accounts?access_token=${accessToken}&debug=all&fields=id%2C%20global_brand_page_name%2C%20about%2C%20category%2C%20category_list%2C%20description%2C%20username%2C%20access_token&format=json&method=get&pretty=0&suppress_http_code=1`
      )
        .then(resp => resp.json()) // Transform the data into json
        .then(data => {
          console.log(data.error === undefined);
          if (!data.error === undefined) {
            window.FB.login(
              response => {
                if (response.authResponse) {
                  localStorage.getItem("auth", JSON.stringify(response));
                  this.props.loginuser(response);
                  this.statusChangeCallback();
                }
              },
              { return_scopes: true }
            );
          } else {
            this.props.getpages(data);
          }
        });
    } else if (status === "not_authorized") {
      alert("Please log into this app.");
      this.setState({ isAuthenticated: false });
    } else {
      alert("Please log into this facebook.");
      this.setState({ isAuthenticated: false });
    }
  }
  render() {
    let pages;
    if (this.props.pages.pages) {
      pages = this.props.pages.pages.map(page => {
        return <SinglePost page={page} key={parseInt(page.id)} />;
      });
    } else {
      pages = "Loading";
    }
    return <div style={{ display: "flex", flexWrap: "wrap" }}>{pages}</div>;
  }
}
const mapStateToProps = state => {
  return { auth: state.auth, pages: state.pages };
};
export default connect(
  mapStateToProps,
  { getpages, setpageloading, loginuser }
)(PageComponent);
