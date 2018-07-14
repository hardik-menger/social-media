import React, { Component } from "react";
import { connect } from "react-redux";
import Datetime from "react-datetime";
import "../common/datepicker.css";
import { withRouter, Link } from "react-router-dom";
class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: "",
      errors: {},
      image: null,
      checked: false,
      date: ""
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleChange = () => {
    this.setState({
      checked: !this.state.checked
    });
  };
  onCheck = date => {
    this.setState({ date: new Date(date._d).getTime() / 1000 });
  };
  onSubmit(e) {
    let submitted = false;
    e.preventDefault();

    const userData = {
      post: this.state.post
    };

    if (!this.state.checked && this.state.image === null) {
      this.props.pages.pageArray.map(post =>
        window.FB.getLoginStatus(response => {
          if (response.status === "connected") {
            window.FB.api(
              "/" + post.id + "/feed",
              "post",
              {
                message: userData.post,
                access_token: post.access_token
              },
              res => {
                if (!res || res.error) {
                  alert(res.error.message);
                } else {
                  this.props.history.push("/");
                  document.getElementsByClassName("fade")[0].style.opacity =
                    "1";
                }
              }
            );
          } else {
            alert("Post Unsuccessfull Login again");
          }
        })
      );
    } else if (this.state.image !== null && this.state.date.length === 0) {
      this.props.pages.pageArray.map(post =>
        window.FB.getLoginStatus(response => {
          if (response.status === "connected") {
            window.FB.api(
              `/${post.id}/feed`,
              "post",
              {
                message: "Test to post a photo",
                src: this.state.image,
                access_token: this.props.auth.user.authResponse.accessToken
              },
              response => {
                if (!response || response.error) {
                  console.log("Failure! ", response.error.message);
                } else {
                  this.props.history.push("/");
                  document.getElementsByClassName("fade")[0].style.opacity =
                    "1";
                }
              }
            );
          }
        })
      );
    } else {
      if (this.state.date.length === 0) {
        alert("Select time duration or uncheck the checkbox");
      } else {
        if (this.state.image === null) {
          this.props.pages.pageArray.map(post =>
            window.FB.getLoginStatus(response => {
              if (response.status === "connected") {
                window.FB.api(
                  "/" + post.id + "/feed",
                  "post",
                  {
                    message: userData.post,
                    scheduled_publish_time: this.state.date,
                    published: false,
                    access_token: post.access_token
                  },
                  res => {
                    if (!res || res.error) {
                      alert("Error occured");
                    } else {
                      this.props.history.push("/");
                    }
                  }
                );
              } else {
                alert("Post Unsuccessfull Login again");
              }
            })
          );
        } else {
          this.props.pages.pageArray.map(post =>
            window.FB.getLoginStatus(response => {
              if (response.status === "connected") {
                window.FB.api(
                  `/${post.id}/feed`,
                  "post",
                  {
                    message: "Test to post a photo",
                    src: this.state.image,
                    access_token: this.props.auth.user.authResponse.accessToken
                  },
                  response => {
                    if (!response || response.error) {
                      console.log("Failure! ", response.error.message);
                    } else {
                      this.props.history.push("/");
                      document.getElementsByClassName("fade")[0].style.opacity =
                        "1";
                    }
                  }
                );
              }
            })
          );
        }
      }
    }
    if (submitted) {
      this.closePopUp();
      this.closeconform();
    }
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  blobToDataURL(blob, callback) {
    var a = new FileReader();
    a.onload = function(e) {
      callback(e.target.result);
    };
    a.readAsDataURL(blob);
  }
  imageupload = e => {
    e.preventDefault();
    var file = this.refs.file.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = e => {
        var idarrayBuffer = e.target.result;
        var blob = new Blob([idarrayBuffer], { type: file.type });

        this.blobToDataURL(blob, data => {
          this.setState({ image: data });
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };
  render() {
    const { errors } = this.state;
    const fileInput = {
      border: "1px solid #ccc",
      display: "inline-block",
      padding: "6px 12px",
      cursor: "pointer"
    };
    const dateinput = this.state.checked ? (
      <div>
        {" "}
        <div
          className=" d-flex justify-content-center"
          style={{ width: "100%" }}
        >
          <Datetime
            onChange={this.onCheck}
            inputProps={{ placeholder: "Click here to set time duration" }}
          />
        </div>
      </div>
    ) : null;
    let selectedfile;
    selectedfile =
      this.state.image !== null ? (
        <div className="card mt-4">
          <div className="card-header">Selected File</div>
          <div className="card-body">
            <div className="d-flex justify-content-around ">
              <div>
                <img
                  className="pr-4"
                  src={this.state.image}
                  alt="Selected File"
                  height="50"
                />
              </div>{" "}
              <div className="ml-4 d-flex justify-content-around align-items-center">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => this.setState({ image: null })}
                >
                  <i className="fas fa-times" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        (selectedfile = <div />)
      );

    return (
      <div
        style={{
          height: "60vh"
        }}
      >
        <Link to="/pages">
          {" "}
          <button type="button" className="btn btn-outline-info mb-4">
            Go back
          </button>
        </Link>
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
              padding: "1rem",
              borderTop: "1px solid #e9ecef"
            }}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <label className="text-muted mr-2">
                Check this to schedule this post
              </label>

              <input
                className="align-self-end"
                type="checkbox"
                checked={this.state.checked}
                onChange={this.handleChange}
              />
            </div>

            <button type="submit" className="btn btn-outline-primary ">
              Post
            </button>
            <label style={{ fileInput }} htmlFor="file">
              <i
                className="fas fa-paperclip mt-3 ml-4"
                style={{
                  fontSize: "27px",
                  color: this.state.image === null ? "darkgray" : "darkseagreen"
                }}
              />
              <input
                style={{ display: "none" }}
                ref="file"
                type="file"
                name="file"
                className="upload-file"
                accept="image/*"
                id="file"
                onChange={this.imageupload}
                encType="multipart/form-data"
              />
            </label>
          </div>
        </form>
        {dateinput}

        {selectedfile}
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
)(withRouter(PostForm));
