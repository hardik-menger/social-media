import React, { Component } from "react";
import { connect } from "react-redux";
class PostForm extends Component {
  constructor(props) {
    super(props);
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
    return <div onClick={this.postToPage}>postform</div>;
  }
}
const mapStateToProps = state => {
  return { auth: state.auth, pages: state.pages };
};
export default connect(
  mapStateToProps,
  null
)(PostForm);
