import React, { Component } from "react";
import { connect } from "react-redux";
import { getpages, setpageloading } from "../../actions/pageaction";
import { loginuser } from "../../actions/authaction";
import Spinner from "../common/spinner";
import loadFbLoginApi from "../../FB/loadsdk";
import Profile from "./profile";
import "../materialInput.css";
import axios from "axios";
import { relative } from "path";
class Profiles extends Component {
  constructor() {
    super();
    this.state = {
      sortby: "1",
      search: "",
      all: [],
      added: [],
      notadded: [],
      loading: false
    };
  }
  addedAll;
  componentDidMount() {
    Promise.resolve(loadFbLoginApi()).then(() => {
      this.statusChangeCallback();
    });
  }
  makeSection(data) {
    // let fbadded = [];
    // let fbnotadded = [];
    // let instaadded = [];
    // let instanotadded = [];
    // let twitteradded = [];
    // let twitternotadded = [];
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
          // (instagramprofiles.indexOf(x.id) !== -1 ? added : notadded).push({
          //   ...x,
          //   type: "instagram"
          // });
          // (twitterprofiles.indexOf(x.id) !== -1 ? added : notadded).push({
          //   ...x,
          //   type: "twitter"
          // });
          if (index === array.length - 1) {
            this.setState({ added, notadded });
            this.props.getpages(added);
            this.setState({ loading: false });
          }
        });
      })
      .catch(err => console.log(err));
  }
  async statusChangeCallback() {
    const auth = JSON.parse(localStorage.getItem("auth"));
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
            this.makeSection(data.data);
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

  searchAndSort = (type, data) => {
    switch (type) {
      case "asc":
        return data.sort((a, b) => {
          var nameA = a.global_brand_page_name.toLowerCase(),
            nameB = b.global_brand_page_name.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
      case "desc":
        return data.sort((a, b) => {
          var nameA = a.global_brand_page_name.toLowerCase(),
            nameB = b.global_brand_page_name.toLowerCase();
          if (nameA > nameB) return -1;
          if (nameA < nameB) return 1;
          return 0;
        });
      case "search":
        let searched;
        searched = data.filter(obj => {
          return (
            obj.global_brand_page_name
              .toLowerCase()
              .indexOf(this.state.search.toLowerCase()) !== -1
          );
        });
        return searched;

      default:
        return data;
    }
  };
  addProfile = (type, id) => {
    this.setState({ loading: true });
    axios
      .post("/api/users/add", { type, id })
      .then(res => {
        this.makeSection(this.state.all);
      })
      .catch(err => {
        console.log(err);
      });
  };
  removeProfile = (type, id) => {
    this.setState({ loading: true });
    axios
      .post("/api/users/remove", { type, id })
      .then(res => {
        this.makeSection(this.state.all);
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    let AddedPages, NotAddedPages;

    if (this.state.all.length !== 0) {
      let added = this.searchAndSort(this.state.sortby, this.state.added);
      let notadded = this.searchAndSort(this.state.sortby, this.state.notadded);
      AddedPages = added.map((page, index) => {
        return (
          <Profile
            page={page}
            key={index}
            status="1"
            addProfile={this.addProfile}
            removeProfile={this.removeProfile}
          />
        );
      });
      NotAddedPages = notadded.map((page, index) => {
        return (
          <Profile
            page={page}
            key={index}
            status="0"
            addProfile={this.addProfile}
            removeProfile={this.removeProfile}
          />
        );
      });
    } else {
      AddedPages = <Spinner />;
      NotAddedPages = <Spinner />;
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
        <h3 className="text-muted text-center">Facebook Profiles</h3>{" "}
        {this.state.loading ? (
          <Spinner style={{ padding: "20%" }} style={{ height: "60vh" }} />
        ) : (
          <div className="d-flex flex-wrap flex-column">
            {this.state.all.length === 0 ? (
              <Spinner />
            ) : (
              [...NotAddedPages, AddedPages]
            )}{" "}
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return { auth: state.auth, pages: state.pages };
};
export default connect(
  mapStateToProps,
  { getpages, setpageloading, loginuser }
)(Profiles);
