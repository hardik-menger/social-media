import React, { Component } from "react";
import { connect } from "react-redux";
// import { groupPost } from "../actions/pageaction";
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile_pic: ""
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

  render() {
    return (
      <div
        className="card text-center"
        style={{ width: "200px", margin: "10px" }}
      >
        <div
          style={{
            marginTop: "10px",
            height: "150px",
            backgroundRepeat: "none",
            backgroundImage: `url(${this.state.profile_pic})`,
            backgroundPosition: `center`,
            backgroundSize: "100%"
          }}
        />
        <div className="card-body" style={{ padding: "5px" }}>
          <h5 className="card-title">
            {this.props.page.global_brand_page_name || "No title"}
          </h5>
          <p className="card-text">{this.props.page.category}</p>
          <div className="checkbox">
            <label>
              <button className="btn btn-primary btn-sm">Add</button>
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
  null
)(Profile);
