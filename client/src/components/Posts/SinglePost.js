import React, { Component } from "react";
import Spinner from "../common/spinner";
export default class SinglePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleted: false
    };
  }

  delete = (id, type) => {
    this.setState({ deleted: true });
    window.FB.api(
      `/${id}`,
      "DELETE",
      { access_token: this.props.token },
      response => {
        if (response && !response.error) {
          if (response.success) {
            this.props.deletefromlist(id, type);
            this.setState({ deleted: false });
          } else {
            alert("Error occured while deleting");
          }
        }
      }
    );
  };
  render() {
    const postDate = this.props.post.created_time
      ? `Posted on ${new Date(this.props.post.created_time).toString()}`
      : `Scheduled on ${new Date(
          this.props.post.scheduled_publish_time * 1000
        )}`;
    return (
      <div className="card" style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: "0",
            right: "0",
            marginLeft: "auto",
            marginRight: "auto",
            top: "50%",
            display: this.state.deleted ? "block" : "none"
          }}
        >
          <Spinner />
        </div>
        <div className="card-header d-flex justify-content-end text-muted">
          {postDate}
        </div>
        <div
          className={
            this.props.post.picture
              ? "card-text m-4 d-flex flex-column align-items-center"
              : "card-text m-4 d-flex justify-content-between"
          }
        >
          {this.props.post.message || "No Message Provided"}{" "}
          {this.props.post.picture ? (
            <img
              src={this.props.post.picture}
              style={{ width: "50%" }}
              alt="postImage"
              className="m-2"
            />
          ) : null}
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => {
              if (window.confirm("Are you sure you wish to delete this Post?"))
                this.delete(this.props.post.id, this.props.type);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
}
