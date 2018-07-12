import React, { Component } from "react";
import { connect } from "react-redux";
import { groupPost } from "../../actions/pageaction";
import { Link } from "react-router-dom";
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
        <Link to="/post">
          <button
            type="button"
            className="btn btn btn-outline-success btn-md m-4"
          >
            Post To Pages
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
  { groupPost }
)(PostConfirmation);
