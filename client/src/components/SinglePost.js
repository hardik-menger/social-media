import React, { Component } from "react";
import { connect } from "react-redux";
import { groupPost } from "../actions/pageaction";
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
      }/picture?type=large&width=300`
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
        style={{ width: "280px", height: "250px", margin: "10px" }}
      >
        <div
          style={{
            height: "150px",
            backgroundRepeat: "none",
            backgroundImage: `url(${this.state.profile_pic})`,
            backgroundPosition: `center`
          }}
        />
        <div className="card-body">
          <h5 className="card-title">
            {this.props.page.global_brand_page_name || "No title"}
          </h5>
          <p className="card-text">{this.props.page.category}</p>
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
