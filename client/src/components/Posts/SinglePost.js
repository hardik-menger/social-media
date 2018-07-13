import React, { Component } from "react";

export default class SinglePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: ""
    };
  }
  delete = id => {
    window.FB.api(
      `/${id}`,
      "DELETE",
      { access_token: this.props.token },
      response => {
        if (response && !response.error) {
          if (response.success) {
            this.setState({ display: "none" });
          } else {
            alert("Error occured while deleting");
          }
        }
      }
    );
  };
  render() {
    console.log(this.state.display);
    return (
      <div className="card mb-2" style={{ display: this.state.display }}>
        <div className="card-header d-flex justify-content-end text-muted">
          Due Date {new Date(this.props.post.created_time).toString()}
        </div>
        <div className="card-text m-4 d-flex justify-content-between">
          {this.props.post.message}{" "}
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
                <div className="modal-body">...</div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-dismiss="modal"
                    onClick={() => this.delete(this.props.post.id)}
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
