import React, { Component } from "react";
import { connect } from "react-redux";
import { getpages, setpageloading } from "../actions/pageaction";
import { loginuser } from "../actions/authaction";
import SinglePost from "./SinglePost";
import Spinner from "./common/spinner";
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
          if (data.error === undefined) {
            this.props.getpages(data);
          } else {
            window.FB.login(
              response => {
                if (response.authResponse) {
                  this.props.loginuser(response);
                }
              },
              { scope: "manage_pages", return_scopes: true }
            );
            this.props.getpages(data);
          }
        });
    } else if (status === "not_authorized") {
      alert("Please log into this app.");
    } else {
      alert("Please log into this facebook.");
    }

    // window.FB.getLoginStatus(response => {
    //   if (response.status === "connected") {
    //     window.FB.api("me/accounts", "get", res => {
    //       if (!res || res.error) {
    //         console.log(res);
    //         alert("Error occured");
    //       } else {
    //         console.log("pages ", res);
    //       }
    //     });
    //   } else {
    //     alert("Post Unsuccessfull Login again");
    //   }
    // });
  }

  render() {
    let pages;
    if (!this.props.pages.loading) {
      pages = this.props.pages.pages.map(page => {
        return <SinglePost page={page} key={parseInt(page.id)} />;
      });
    } else {
      pages = <Spinner />;
    }
    return <div style={{ display: "flex", flexWrap: "wrap" }}> {pages}</div>;
  }
}
const mapStateToProps = state => {
  return { auth: state.auth, pages: state.pages };
};
export default connect(
  mapStateToProps,
  { getpages, setpageloading, loginuser }
)(PageComponent);
