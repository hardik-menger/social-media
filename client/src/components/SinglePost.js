import React, { Component } from "react";
import { connect } from "react-redux";
import PostForm from "./forms/PostForm";
import { groupPost } from "../actions/pageaction";
import { Link } from "react-router-dom";
class SinglePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile_pic: "",
      isChecked: false,
      selectedArray: [],
      added: false
    };
  }
  componentDidMount() {
    fetch(
      `https://graph.facebook.com/v3.0/${
        this.props.page.id
      }/picture?access_token=${
        this.props.auth.user.authResponse.accessToken
      }&type=large&width=300`
    )
      .then(data => {
        this.setState({ profile_pic: data.url.toString() });
      })
      .catch(err => console.log(err));
  }
  toggleAdd(page) {
    this.setState({ added: !this.state.added });
    this.props.groupPost(page);
  }
  render() {
    return (
      <div
        className="card"
        style={{ width: "280px", height: "450px", margin: "10px" }}
      >
        <div
          style={{
            height: "150px",
            backgroundImage: `url(${this.state.profile_pic})`,
            backgroundPosition: `center`
          }}
        />
        <div className="card-body">
          <h5 className="card-title">
            {this.props.page.global_brand_page_name || "No title"}
          </h5>
          <p className="card-text">
            {this.props.page.about || "No Description"}
          </p>
          {/* <Link
            to={
              "/page/" + this.props.page.id + "/" + this.props.page.access_token
            }
            params={{ id: this.props.page.id }}
            className="btn btn-primary"
          >
            Go somewhere
           */}
          <div className="checkbox">
            <label>
              <button
                className={
                  this.state.added
                    ? "btn btn-success btn-sm"
                    : "btn btn-primary btn-sm"
                }
                onClick={() => this.toggleAdd(this.props.page)}
              >
                {this.state.added ? "Added" : "Add"}
              </button>
            </label>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm "
            data-toggle="modal"
            data-target="#myModal"
          >
            Modal
          </button>
          <div
            className="modal fade"
            id="myModal"
            role="dialog"
            aria-labelledby="myModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLongTitle">
                    Modal title
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
                  <PostForm />
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
      </div>
    );
  }
}
const mapStateToProps = state => {
  return { auth: state.auth, pageArray: state.pageArray };
};
export default connect(
  mapStateToProps,
  { groupPost }
)(SinglePost);
