import React, { Component } from "react";
import { connect } from "react-redux";
import { loginuser } from "../../actions/authaction";
import SinglePost from "./SinglePost";
class PostComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notpublished: null
    };
  }
  componentDidMount() {
    fetch(
      `https://graph.facebook.com/v3.0/${
        this.props.match.params.pageid
      }/promotable_posts?access_token=${
        this.props.match.params.token
      }&debug=all&format=json&is_published=false&method=get&pretty=0&suppress_http_code=1`
    ).then(data =>
      data.json().then(d => this.setState({ notpublished: d.data }))
    );
  }

  render() {
    return (
      <div>
        {this.state.notpublished === null ||
        this.state.notpublished === undefined ||
        this.state.notpublished.length === 0 ? (
          <p>No Pending Posts</p>
        ) : (
          this.state.notpublished.map(post => (
            <SinglePost
              post={post}
              key={post.id}
              token={this.props.match.params.token}
            />
          ))
        )}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return { auth: state.auth, pages: state.pages };
};
export default connect(
  mapStateToProps,
  { loginuser }
)(PostComponent);
