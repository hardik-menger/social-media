import React, { Component } from "react";
import { connect } from "react-redux";
import { getpages, setpageloading } from "../actions/pageaction";
import { loginuser } from "../actions/authaction";
import SinglePage from "./SinglePage";
import Spinner from "./common/spinner";
import loadFbLoginApi from "../FB/loadsdk";
import PostConfirmation from "./PostConfirmation/PostConfirmation";
import { groupPostToAll } from "../actions/pageaction";
import "./materialInput.css";
class PageComponent extends Component {
  constructor() {
    super();
    this.addedAll = false;
    this.state = { sortby: "1", search: "" };
  }
  addedAll;
  componentDidMount() {
    try {
      Promise.resolve(loadFbLoginApi()).then(() => {
        this.statusChangeCallback();
      });
    } catch (err) {
      console.log(err);
    }
  }
  async statusChangeCallback() {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const { accessToken } = this.props.auth.user.authResponse;
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
                this.statusChangeCallback();
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
      let fetchedPages = this.searchAndSort(this.state.sortby);
      pages = fetchedPages.map((page, index) => {
        return <SinglePage page={page} key={index} />;
      });
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
          </div>
        </div>
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
            disabled={this.props.pages.pageArray.length === 0}
          >
            Confirm Pages
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
  { getpages, setpageloading, loginuser, groupPostToAll }
)(PageComponent);
