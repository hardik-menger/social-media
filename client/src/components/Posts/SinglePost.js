import React, { Component } from "react";

export default class SinglePost extends Component {
  delete = (id, type) => {
    window.FB.api(
      `/${id}`,
      "DELETE",
      { access_token: this.props.token },
      response => {
        if (response && !response.error) {
          if (response.success) {
            this.props.deletefromlist(id, type);
          } else {
            alert("Error occured while deleting");
          }
        }
      }
    );
  };
  render() {
    return (
      <div className="card mb-2">
        <div className="card-header d-flex justify-content-end text-muted">
          Due Date {new Date(this.props.post.created_time).toString()}
        </div>
        <div className="card-text m-4 d-flex justify-content-between">
          {this.props.post.message || "No Message Provided"}{" "}
          {this.props.post.picture ? (
            <img src={this.props.post.picture} width="50" alt="post-image" />
          ) : null}
          <button
            type="button"
            className="btn btn-outline-danger"
            data-toggle="modal"
            data-target="#confirmDelete"
          >
            Delete
          </button>
          <div
            className="modal fade"
            id="confirmDelete"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="confirmDeleteLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="confirmDeleteLabel">
                    Confirm
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
                  Are you sure you want to delete this post
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-dismiss="modal"
                    onClick={() =>
                      this.delete(this.props.post.id, this.props.type)
                    }
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
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
