import React, { Component } from "react";
import { connect } from "react-redux";
import { groupPost } from "../../actions/pageaction";
import PostForm from "../forms/PostForm";
class PostConfirmation extends Component {
  closePopUp = () => {
    document.getElementById("close").click();
  };
  removeFromList = page => {
    this.props.groupPost(page);
    if (this.props.pages.pageArray.length === 1) this.closePopUp();
  };
  render() {
    let list;
    list = this.props.pages.pageArray.map((post, index) => (
      <li
        className="list-group-item d-flex justify-content-between "
        key={index}
      >
        {post.global_brand_page_name}
        <i
          className="fas fa-trash "
          onClick={() => {
            this.removeFromList(post);
          }}
        />
      </li>
    ));

    return (
      <div>
        <ul className="list-group list-group-flush ">{list}</ul>
        <button
          type="button"
          className="btn btn btn-outline-success btn-md m-4"
          data-toggle="modal"
          data-target="#postform"
        >
          Post To Pages
        </button>
        <div
          className="modal fade "
          id="postform"
          role="dialog"
          aria-labelledby="myModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
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
                <PostForm />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-default closeform"
                  data-dismiss="modal"
                  id="close"
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
  return { auth: state.auth, errors: state.error, pages: state.pages };
};
export default connect(
  mapStateToProps,
  { groupPost }
)(PostConfirmation);
