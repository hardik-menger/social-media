import React, { Component } from "react";
import { connect } from "react-redux";
import { groupPost } from "../../actions/pageaction";
import { Link } from "react-router-dom";
import { addTwitterToArray } from "../../actions/authaction";
import { withRouter } from "react-router-dom";
class PostConfirmation extends Component {
  removeFromList = page => {
    this.props.groupPost(page);
    if (this.props.pages.pageArray.length === 1)
      document.getElementById("hidePopUpBtn").click();
  };
  constructor() {
    super();
    this.state = { Tdisplay: "block" };
  }
  render() {
    let list;

    list = this.props.pages.pageArray.map((post, index) => {
      return (
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
      );
    });
    let twitterbox;
    if (this.props.auth.twitter.add) {
      twitterbox = (
        <li
          className="list-group-item d-flex justify-content-between "
          style={{ display: this.state.Tdisplay }}
          key="twitter"
        >
          <i className="lead"> Twitter Account: </i>{" "}
          {this.props.auth.twitter.screen_name}
          <i
            className="fas fa-trash "
            onClick={() => {
              this.props.addTwitterToArray(false);
            }}
          />
        </li>
      );
    }
    return (
      <div>
        <ul className="list-group list-group-flush">{[...list, twitterbox]}</ul>
        <Link to="/post">
          <button
            type="button"
            className="btn btn btn-outline-success btn-md m-4"
            onClick={this.closePopUp}
          >
            Post To Pages
          </button>
          <button
            id="hidePopUpBtn"
            type="button"
            className="close"
            data-dismiss="modal"
            style={{ display: "none" }}
          >
            &times;
          </button>
        </Link>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return { auth: state.auth, errors: state.error, pages: state.pages };
};
export default connect(
  mapStateToProps,
  { groupPost, addTwitterToArray }
)(withRouter(PostConfirmation));
