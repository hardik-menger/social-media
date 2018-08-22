import React, { Component } from "react";
import SinglePost from "./SinglePost";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import loadFbLoginApi from "../../FB/loadsdk";
import { loginuser } from "../../actions/authaction";
class PostComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notpublished: [],
      published: []
    };
  }
  componentDidMount() {
    Promise.resolve(loadFbLoginApi()).then(() => {
      this.statusChangeCallback();
    });
  }
  async statusChangeCallback() {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const { status } = auth.user;
    if (status === "connected") {
      await fetch(
        `https://graph.facebook.com/v3.0/${
          this.props.match.params.pageid
        }/scheduled_posts?fields=message,creation_time,modified_time,picture,thumbnail,scheduled_publish_time&access_token=${
          this.props.match.params.token
        }`
      ).then(data =>
        data.json().then(d => {
          if (d.error === undefined) {
            this.setState({ notpublished: d.data });
          } else {
            window.FB.login(response => {
              if (response.authResponse) {
                this.props.loginuser(response);

                this.props.history.push("/pages");
                alert("Your token expireed .. ");
              }
            });
          }
        })
      );
      await fetch(
        `https://graph.facebook.com/v3.0/${
          this.props.match.params.pageid
        }/feed?access_token=${
          this.props.match.params.token
        }&fields=picture,id,created_time,story,message&debug=all&format=json&is_published=true&method=get&pretty=0&suppress_http_code=1`
      ).then(data =>
        data.json().then(d => {
          console.log(d.data);
          this.setState({ published: d.data });
        })
      );
    }
  }

  deletefromlist = (id, type) => {
    if (type === "published") {
      let arr = [...this.state.published];
      var removeIndex = arr
        .map(function(item) {
          return item.id;
        })
        .indexOf(id);
      arr.splice(removeIndex, 1);
      this.setState({ published: arr });
    } else {
      let arr = [...this.state.notpublished];
      removeIndex = arr
        .map(function(item) {
          return item.id;
        })
        .indexOf(id);
      arr.splice(removeIndex, 1);
      this.setState({
        notpublished: arr
      });
    }
  };

  render() {
    return (
      <div>
        <h3 className="mt-4"> Pending Posts</h3>
        <hr />
        <div className="d-flex flex-wrap">
          {this.state.notpublished === null ||
          this.state.notpublished === undefined ||
          this.state.notpublished.length === 0 ? (
            <p className="ml-4 mt-4">No Pending Posts</p>
          ) : (
            this.state.notpublished.map(post => (
              <div className="mb-2 col-sm-12 col-md-4" key={post.id}>
                {" "}
                <SinglePost
                  post={post}
                  token={this.props.match.params.token}
                  type="notpublished"
                  id={post.id}
                  deletefromlist={this.deletefromlist}
                />{" "}
              </div>
            ))
          )}
        </div>
        <h3 className="mt-4"> Uploaded Posts</h3>
        <hr />
        <div className="d-flex flex-wrap">
          {this.state.published === null ||
          this.state.published === undefined ||
          this.state.published.length === 0 ? (
            <p className="ml-4 mt-4">No Uploaded Posts</p>
          ) : (
            this.state.published.map(post => (
              <div className="mb-2 col-sm-12 col-md-4" key={post.id}>
                <SinglePost
                  post={post}
                  index={`${post.id}`}
                  token={this.props.match.params.token}
                  type="published"
                  key={post.id}
                  deletefromlist={this.deletefromlist}
                />
              </div>
            ))
          )}
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
  { loginuser }
)(withRouter(PostComponent));
