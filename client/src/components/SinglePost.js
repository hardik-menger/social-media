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
  findIfAlreadyAdded(pageid) {
    if (
      this.props.pages.pageArray.filter(
        page => parseInt(page.id, 10) === pageid
      ).length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  render() {
    return (
      <div
        className="card text-center"
        style={{ width: "200px", height: "250px", margin: "10px" }}
      >
        <div
          style={{
            marginTop: "10px",
            height: "150px",
            backgroundRepeat: "none",
            backgroundImage: `url(${this.state.profile_pic})`,
            backgroundPosition: `center`,
            backgroundSize: "70%"
          }}
        />
        <div className="card-body" style={{ padding: "5px" }}>
          <h5 className="card-title">
            {this.props.page.global_brand_page_name || "No title"}
          </h5>
          <p className="card-text">{this.props.page.category}</p>
          <div className="checkbox">
            <label>
              <button
                className={
                  this.findIfAlreadyAdded(parseInt(this.props.page.id, 10))
                    ? "btn btn-success btn-sm"
                    : "btn btn-primary btn-sm"
                }
                onClick={() => this.toggleAdd(this.props.page)}
              >
                {this.findIfAlreadyAdded(parseInt(this.props.page.id, 10))
                  ? "Added"
                  : "Add"}
              </button>
            </label>
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
  { groupPost }
)(SinglePost);
