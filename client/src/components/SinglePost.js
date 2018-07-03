import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
class SinglePost extends Component {
  constructor(props) {
    super(props);
    this.state = { profile_pic: "" };
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
  render() {
    console.log(this.props.page.access_token);
    return (
      <div
        className="card"
        style={{ width: "280px", height: "450px", margin: "10px" }}
      >
        <div
          style={{
            height: "150px",
            backgroundImage: `url(${this.state.profile_pic})`
          }}
        />
        <div className="card-body">
          <h5 className="card-title">
            {this.props.page.global_brand_page_name || "No title"}
          </h5>
          <p className="card-text">
            {this.props.page.about || "No Description"}
          </p>
          <Link
            to={
              "/page/" + this.props.page.id + "/" + this.props.page.access_token
            }
            params={{ id: this.props.page.id }}
            className="btn btn-primary"
          >
            Go somewhere
          </Link>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return { auth: state.auth };
};
export default connect(
  mapStateToProps,
  null
)(SinglePost);
