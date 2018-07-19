import React, { Component } from "react";
import SinglePost from "./SinglePost";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
class PostComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notpublished: [],
      published: []
    };
  }
  componentDidMount() {
    fetch(
      `https://graph.facebook.com/v3.0/${
        this.props.match.params.pageid
      }/scheduled_posts?fields=message,creation_time,modified_time,picture,thumbnail,scheduled_publish_time&access_token=${
        this.props.match.params.token
      }`
    ).then(data =>
      data.json().then(d => this.setState({ notpublished: d.data }))
    );
    // fetch(
    //   `https://graph.facebook.com/v2.5/${
    //     this.props.match.params.pageid
    //   }/scheduled_posts_internal?access_token=EAAD4tyD9cRABAKqBshHJOhANZBFHlNPoVzy48VNaRIOAhPha0xRsPuZAhjJAAXU6Pc9IyMuvmfMTyEBEp1XZBLO6Ms4TKjwVeHS7rlEXk5uOUHRC6cdo8dh1oCPrbwlASEiAYpwik5ZAwd9Sy7V71Ic3NiFvGLpu0UZC1FwkZAiCM4BiG0eoCyP18UnrV0XGqjkZC0OBBnZBMAZDZD&_reqName=object%3Apage%2Fscheduled_posts_internal&fields=%5B%22message%22%2C%22creation_time%7Bname%22%2C%22permalink_url%7Bname%7D%22%2C%22scheduled_publish_time%22%2C%22thumbnail&locale=en_GB&method=get&pretty=0&sdk=joey&sort=%5B%22scheduled_publish_time_ascending%22%5D&summary=true&suppress_http_code=1`
    // ).then(data =>
    //   data.json().then(d => {
    //     console.log(d.data);
    //     // this.setState({ notpublished: d.data });
    //   })
    // );
    // console.log(
    //   this.props,
    //   this.props.auth.user.authResponse.accessToken,
    //   "EAAD4tyD9cRABAFQOv6dbu93mC68uHpcbQBxAvLBRNPX4ah6fsTOKsEqElIfeJCZAheLr0VgdR9tHgTefoNHvWKvvrv26g7Q6sry063DBIGX42ZCR9PdLmTcLVPkhPlaoKkKc7voUb9NZAE4SN4ZAzZC7XTuNIw65Fm83W5AMtuKVUeDVIum3X6wY4jHWkL92tETbjhic6tQZDZD"
    //   "EAAD4tyD9cRABAKqBshHJOhANZBFHlNPoVzy48VNaRIOAhPha0xRsPuZAhjJAAXU6Pc9IyMuvmfMTyEBEp1XZBLO6Ms4TKjwVeHS7rlEXk5uOUHRC6cdo8dh1oCPrbwlASEiAYpwik5ZAwd9Sy7V71Ic3NiFvGLpu0UZC1FwkZAiCM4BiG0eoCyP18UnrV0XGqjkZC0OBBnZBMAZDZD"
    // );
    // console.log(this.props.auth.user.authResponse.accessToken);
    // window.FB.api(
    //   `/${this.props.match.params.pageid}/scheduled_posts_internal`,
    //   "GET",
    //   {
    //     access_token:
    //       "EAAD4tyD9cRABAFQOv6dbu93mC68uHpcbQBxAvLBRNPX4ah6fsTOKsEqElIfeJCZAheLr0VgdR9tHgTefoNHvWKvvrv26g7Q6sry063DBIGX42ZCR9PdLmTcLVPkhPlaoKkKc7voUb9NZAE4SN4ZAzZC7XTuNIw65Fm83W5AMtuKVUeDVIum3X6wY4jHWkL92tETbjhic6tQZDZD",
    //     _reqName: "object:page/scheduled_posts_internal",
    //     fields:
    //       '["message","creation_time","permalink_url","scheduled_publish_time","thumbnail"]',

    //     sort: '["scheduled_publish_time_ascending"]'
    //   },
    //   function(response) {
    //     console.log(response.data, response.error);
    //   }
    // );

    fetch(
      `https://graph.facebook.com/v3.0/${
        this.props.match.params.pageid
      }/feed?access_token=${
        this.props.match.params.token
      }&fields=picture,id,created_time,story,message&debug=all&format=json&is_published=true&method=get&pretty=0&suppress_http_code=1`
    ).then(data => data.json().then(d => this.setState({ published: d.data })));
  }

  deletefromlist = (id, type) => {
    console.log(id, type);
    window.FB.api(
      `/${id}`,
      "DELETE",
      { access_token: this.props.match.params.token },
      response => {
        if (response && !response.error) {
          if (response.success) {
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
              console.log(this.state);
              let arr = [...this.state.unpublished];
              removeIndex = arr
                .map(function(item) {
                  return item.id;
                })
                .indexOf(id);
              arr.splice(removeIndex, 1);
              this.setState({
                published: arr
              });
            }
          } else {
            alert("Error occured while deleting");
          }
        }
      }
    );
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
                  deletefromlist={this.deletefromlist}
                  type="notpublished"
                />
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
                  token={this.props.match.params.token}
                  deletefromlist={this.deletefromlist}
                  type="published"
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
  return { auth: state.auth, pages: state.pages };
};
export default connect(
  mapStateToProps,
  null
)(withRouter(PostComponent));
