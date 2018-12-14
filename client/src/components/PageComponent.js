import React, { Component } from "react";
import { connect } from "react-redux";
import { getpages } from "../actions/pageaction";
import { loginuser, addTwitterToArray } from "../actions/authaction";
import SinglePage from "./SinglePage";
import Spinner from "./common/spinner";
import loadFbLoginApi from "../FB/loadsdk";
import PostConfirmation from "./PostConfirmation/PostConfirmation";
import { groupPostToAll } from "../actions/pageaction";
import "./materialInput.css";
import axios from "axios";
import "../utils/checkbox.css";
class PageComponent extends Component {
  constructor() {
    super();
    this.addedAll = false;
    this.state = { sortby: "1", search: "", twitterPublish: false };
  }
  addedAll;
  componentDidMount() {
    Promise.resolve(loadFbLoginApi()).then(() => {
      this.statusChangeCallback();
    });
  }
  makeSection(data) {
    let facebookprofiles = [];
    let instagramprofiles = [];
    let twitterprofiles = [];
    let added = [];
    let notadded = [];
    axios
      .get("/api/users/profiles")
      .then(user => {
        //got page ids foor apps
        facebookprofiles = user.data.facebookprofiles;
        instagramprofiles = user.data.instagramprofiles;
        twitterprofiles = user.data.twitterprofiles;
        //sort into added and not added
        data.forEach((x, index, array) => {
          (facebookprofiles.indexOf(x.id) !== -1 ? added : notadded).push({
            ...x,
            type: "facebook"
          });
          if (index === array.length - 1) {
            this.setState({ added: { data: { added } }, notadded });
            this.props.getpages(added);
          }
        });
      })
      .catch(err => console.log(err));
  }
  async statusChangeCallback() {
    const auth = !!JSON.parse(localStorage.getItem("auth"))
      ? JSON.parse(localStorage.getItem("auth"))
      : {};
    if (this.props.auth.appAuth) {
      const { accessToken } = auth.appData.authResponse;
      const { status } = auth.appData;

      if (status === "connected") {
        await fetch(
          `https://graph.facebook.com/v3.0/me/accounts?access_token=${accessToken}&debug=all&fields=id%2C%20global_brand_page_name%2C%20about%2C%20category%2C%20category_list%2C%20description%2C%20username%2C%20access_token&format=json&method=get&pretty=0&suppress_http_code=1`
        )
          .then(resp => resp.json()) // Transform the data into json
          .then(data => {
            if (data.error === undefined) {
              this.setState({ all: data.data });
              this.makeSection(data.data);
            } else {
              window.FB.login(response => {
                if (response.authResponse) {
                  this.props.loginuser(response);
                  this.statusChangeCallback();
                }
              });
              this.setState({ all: data.data });
            }
          });
      } else if (status === "not_authorized") {
        alert("Please log into this app.");
      } else {
        alert("Please log into this facebook.");
      }
    }
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value, sortby: "search" });
  };
  addAll = () => {
    this.props.groupPostToAll(this.props.pages.pages);
  };

  searchAndSort = type => {
    switch (type) {
      case "asc":
        return this.props.pages.pages.sort((a, b) => {
          var nameA = a.global_brand_page_name.toLowerCase(),
            nameB = b.global_brand_page_name.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
      case "desc":
        return this.props.pages.pages.sort((a, b) => {
          var nameA = a.global_brand_page_name.toLowerCase(),
            nameB = b.global_brand_page_name.toLowerCase();
          if (nameA > nameB) return -1;
          if (nameA < nameB) return 1;
          return 0;
        });
      case "search":
        let searched;
        searched = this.props.pages.pages.filter(obj => {
          return (
            obj.global_brand_page_name
              .toLowerCase()
              .indexOf(this.state.search.toLowerCase()) !== -1
          );
        });
        return searched;

      default:
        return this.props.pages.pages;
    }
  };
  addTwitter = e => {
    this.props.addTwitterToArray(e.target.checked);
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
    if (this.props.pages.pages.length !== 0) {
      let fetchedPages = this.searchAndSort(this.state.sortby);
      pages = fetchedPages.map((page, index) => {
        return <SinglePage page={page} key={index} />;
      });
    } else if (!this.props.auth.appAuth) {
      pages = (
        <p className="lead m-4">
          No facebook pages to show please sign in with facebook
        </p>
      );
    } else {
      pages = <Spinner />;
    }
    return (
      <div>
        <div className="d-flex justify-content-between">
          <div className="dropdown show">
            <p
              className="btn btn-sm dropdown-toggle "
              role="button"
              id="dropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Sort
            </p>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li
                className="dropdown-item ml-2 "
                onClick={() => this.setState({ sortby: "asc" })}
                style={{ padding: "0" }}
              >
                A-Z
              </li>
              <li
                className="dropdown-item ml-2"
                style={{ margin: "0", padding: "0" }}
                onClick={() => this.setState({ sortby: "desc" })}
              >
                Z-A
              </li>
            </div>
          </div>
          <div className="group">
            <input
              type="search"
              value={this.state.post}
              onChange={this.onChange}
              name="search"
              required
            />
            <span className="highlight" />
            <span className="bar" />
            <label className="materiallabel">Search</label>
          </div>{" "}
        </div>
        {this.props.auth.twitterAuth ? (
          <div className="card ml-2 mr-2">
            <div className="card-body d-flex justify-content-between">
              <img
                src={this.props.auth.twitter.profile_image_url}
                style={{ borderRadius: "50%" }}
              />
              <p className="lead m-0" style={{ lineHeight: "30px" }}>
                Post to twitter handle {this.props.auth.twitter.screen_name}?
              </p>
              <div className="switch_box box_1">
                <input
                  type="checkbox"
                  className="switch_1"
                  onChange={this.addTwitter}
                />
              </div>
            </div>
          </div>
        ) : null}{" "}
        <div style={{ display: "flex", flexWrap: "wrap" }}> {pages}</div>
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-info btn-md "
            data-toggle="modal"
            data-target="#myModal"
            style={{ marginRight: "10px" }}
            onClick={this.addAll}
            disabled={
              !this.props.auth.twitter.add &&
              this.props.pages.pageArray.length === 0
            }
          >
            Select All
          </button>
          <button
            type="button"
            className="btn btn-info btn-md "
            data-toggle="modal"
            data-target="#myModal"
            disabled={
              !this.props.auth.twitter.add &&
              this.props.pages.pageArray.length === 0
            }
          >
            Confirm Inputs
          </button>
        </div>
        <div
          className="modal fade nopadding"
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
                  id="close"
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
    );
  }
}
const mapStateToProps = state => {
  return { auth: state.auth, pages: state.pages };
};
export default connect(
  mapStateToProps,
  { getpages, loginuser, addTwitterToArray, groupPostToAll }
)(PageComponent);
