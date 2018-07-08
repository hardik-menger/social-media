import React, { Component } from "react";
import { connect } from "react-redux";
import { getpages, setpageloading } from "../actions/pageaction";
import { loginuser } from "../actions/authaction";
import SinglePost from "./SinglePost";
import Spinner from "./common/spinner";
import loadFbLoginApi from "../FB/loadsdk";
import PostConfirmation from "./PostConfirmation/PostConfirmation";
import { groupPostToAll } from "../actions/pageaction";
class PageComponent extends Component {
  constructor() {
    super();
    this.addedAll = false;
  }
  addedAll;
  componentDidMount() {
    Promise.resolve(loadFbLoginApi()).then(() => {
      this.statusChangeCallback();
    });
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
            window.FB.login(response => {
              if (response.authResponse) {
                this.props.loginuser(response);
                this.props.getpages(data);
              }
            });
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
    //         alert("Error occured", res);
    //       } else {
    //         console.log(res.data);
    //         this.props.loginuser(res.data);
    //       }
    //     });
    //   } else {
    //     alert("Post Unsuccessfull Login again");
    //   }
    // });
  }
  addAll = () => {
    this.props.groupPostToAll(this.props.pages.pages);
  };
  render() {
    const modalDialog = {
      width: "100%",
      height: " 100%",
      margin: "0px",
      padding: "0px",
      maxWidth: "100%"
    };

    const modalContent = {
      height: "auto",
      minHeight: "100%",
      borderRadius: "0",
      width: "100%",
      margin: "0px"
    };
    let pages;
    if (this.props.pages.pages) {
      pages = this.props.pages.pages.map((page, index) => {
        return (
          <div>
            <SinglePost page={page} key={index} />
          </div>
        );
      });
    } else {
      pages = <Spinner />;
    }
    return (
      <div>
        <div style={{ display: "flex", flexWrap: "wrap" }}> {pages}</div>
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-info btn-md "
            data-toggle="modal"
            data-target="#myModal"
            style={{ marginRight: "10px" }}
            onClick={this.addAll}
          >
            Select All
          </button>
          <button
            type="button"
            className="btn btn-info btn-md "
            data-toggle="modal"
            data-target="#myModal"
          >
            Confirm Pages
          </button>
        </div>
        <div
          className="modal fade"
          id="myModal"
          role="dialog"
          aria-labelledby="myModalLabel"
          aria-hidden="true"
          style={{
            maxWidth: "100%"
          }}
        >
          <div className="modal-dialog" style={modalDialog}>
            <div className="modal-content" style={modalContent}>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Confirm Pages
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <PostConfirmation />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-default"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return { auth: state.auth, pages: state.pages };
};
export default connect(
  mapStateToProps,
  { getpages, setpageloading, loginuser, groupPostToAll }
)(PageComponent);
