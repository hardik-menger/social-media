import React, { Component } from "react";
import { connect } from "react-redux";
class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: "",
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(e) {
    e.preventDefault();

    const userData = {
      post: this.state.post
    };
    console.log(userData);
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  componentDidMount() {}
  // postToPage = () => {
  //   window.FB.getLoginStatus(
  //     function(response) {
  //       if (response.status === "connected") {
  //         window.FB.api(
  //           "/" + this.props.match.params.pageid + "/feed",
  //           "post",
  //           {
  //             message: "test 2",
  //             access_token: this.props.match.params.accesstoken
  //           },
  //           res => {
  //             console.log(res);
  //           }
  //         );
  //       } else {
  //         alert("Login Unsuccessfull");
  //       }
  //     }.bind(this)
  //   );
  // };
  render() {
    const { errors } = this.state;
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <div className="input-group">
            <div className="input-group-prepend">
              <span
                className="input-group-text"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <i>Whats on </i>
                <i>your mind</i>
              </span>
            </div>
            <textarea
              className="form-control"
              aria-label="With textarea"
              value={this.state.post}
              onChange={this.onChange}
              type="text"
              error={errors.email}
              placeholder="Enter yout post"
              name="post"
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "1rem",
              borderTop: "1px solid #e9ecef"
            }}
          >
            <button type="submit" className="btn btn-outline-primary ">
              Post
            </button>
          </div>
        </form>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return { auth: state.auth, errors: state.error, pages: state.pages };
};
export default connect(
  mapStateToProps,
  null
)(PostForm);
