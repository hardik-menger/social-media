import React, { Component } from "react";
import { connect } from "react-redux";
import Datetime from "react-datetime";
import "../common/datepicker.css";
import { withRouter, Link } from "react-router-dom";
import Dropzone from "react-dropzone";
import request from "superagent";
import axios from "axios";

const CLOUDINARY_UPLOAD_PRESET = "cnt10dyt";
const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dnffetztd/upload";
class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: "",
      promptMedia: false,
      checked: false,
      date: "",
      uploadedFileCloudinaryUrl: null,
      selectedFile: null
    };
    this.onSubmit = this.onSubmit.bind(this);
  }
  onImageDrop(files) {
    this.setState({
      uploadedFile: files[0]
    });
    this.handleImageUpload(files[0]);
  }
  //cloudinary upload and store url in state
  handleImageUpload(file) {
    let upload = request
      .post(CLOUDINARY_UPLOAD_URL)
      .field("upload_preset", CLOUDINARY_UPLOAD_PRESET)
      .field("file", file);

    upload.end((err, response) => {
      if (err) {
        alert(err);
      }

      if (response.body.secure_url !== "") {
        this.setState({
          uploadedFileCloudinaryUrl: response.body.secure_url
        });
      }
    });
  }
  //schedule post controller
  handleChange = () => {
    this.setState({
      checked: !this.state.checked
    });
  };
  //date for submission of post converted to valid fprmat
  onCheck = date => {
    this.setState({ date: new Date(date._d).getTime() / 1000 });
  };
  //form submission facebook cases
  onSubmit = e => {
    e.preventDefault();
    let unpublishedPages = [];
    let publishedPages = [];
    let alertmessg;
    const userData = {
      post: this.state.post
    };
    let length = this.props.pages.pageArray.length;
    let i = 0;
    if (length === 0) {
      this.props.history.push("/pages");
    }
    if (this.state.twitterImageUpload) {
      this.onSubmitTwitter();
    }
    if (!this.state.checked && this.state.image === null) {
      i = 0;
      this.props.pages.pageArray.map((post, index) =>
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
                  alertmessg = res.error.message;
                  unpublishedPages.push(post.global_brand_page_name);
                } else {
                  i++;
                  publishedPages.push(post.global_brand_page_name);

                  if (i === length) {
                    alert(
                      `Posted successfully on ${publishedPages.join(", ")}`
                    );
                  }

                  document.getElementsByClassName("fade")[0].style.opacity =
                    "1";
                }
              }
            );
          }
        })
      );
    } else if (this.state.image !== null && this.state.date.length === 0) {
      i = 0; // eslint-disable-next-line
      this.props.pages.pageArray.map((post, index) => {
        window.FB.getLoginStatus(response => {
          if (response.status === "connected") {
            window.FB.api(
              `/${post.id}/feed`,
              "post",
              {
                message: this.state.post,
                source: this.state.uploadedFileCloudinaryUrl,
                access_token: post.access_token
              },
              response => {
                if (!response || response.error) {
                  alertmessg = response.error.message;
                  unpublishedPages.push(post.global_brand_page_name);
                  alert(
                    `${alertmessg} Error occured while posting to ${
                      post.global_brand_page_name
                    }`
                  );
                } else {
                  i++;
                  publishedPages.push(post.global_brand_page_name);

                  if (i === length) {
                    alert(
                      `Posted successfully on ${publishedPages.join(", ")}`
                    );
                  }

                  document.getElementsByClassName("fade")[0].style.opacity =
                    "1";
                }
              }
            );
          }
        });
      });
    } else {
      if (this.state.date.length === 0) {
        alert("Select time duration or uncheck the checkbox");
      } else {
        if (this.state.image === null) {
          i = 0;
          this.props.pages.pageArray.map((post, index) =>
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
                      alertmessg = res.error.message;
                      unpublishedPages.push(post.global_brand_page_name);
                      alert(
                        `${alertmessg} Error occured while posting to ${
                          post.global_brand_page_name
                        }`
                      );
                    } else {
                      i++;
                      publishedPages.push(post.global_brand_page_name);
                      if (i === length) {
                        alert(
                          `Posted successfully on ${publishedPages.join(", ")}`
                        );
                      }

                      document.getElementsByClassName("fade")[0].style.opacity =
                        "1";
                    }
                  }
                );
              }
            })
          );
        } else {
          i = 0;
          this.props.pages.pageArray.map((post, index) =>
            window.FB.getLoginStatus(response => {
              if (response.status === "connected") {
                window.FB.api(
                  `/${post.id}/feed`,
                  "post",
                  {
                    scheduled_publish_time: this.state.date,
                    published: false,
                    message: this.state.post,
                    source: this.state.uploadedFileCloudinaryUrl,
                    access_token: post.access_token
                  },
                  response => {
                    if (!response || response.error) {
                      alertmessg = response.error.message;
                      alert(
                        `${alertmessg} Error occured while posting to ${
                          post.global_brand_page_name
                        }`
                      );
                    } else {
                      i++;
                      publishedPages.push(post.global_brand_page_name);
                      if (i === length) {
                        alert(
                          `Posted successfully on ${publishedPages.join(", ")}`
                        );
                      }

                      if (index === length - 1)
                        document.getElementsByClassName(
                          "fade"
                        )[0].style.opacity = "1";
                    }
                  }
                );
              }
            })
          );
        }
      }
    }
  };
  //simple status upload for twitter
  onSubmitTwitter = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const accessSecret = auth.twitter.accessSecret;
    const accessToken = auth.twitter.accessToken;
    const status = this.state.post;
    axios
      .post("/api/twitter/status", { accessSecret, accessToken, status })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err.data);
      });
  };
  onPostChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  //store uploaded media in state
  fileChangedHandler = event => {
    this.setState({ selectedFile: event.target.files[0] });
  };
  //send media to server
  uploadHandler = () => {
    let formData = new FormData();
    const auth = JSON.parse(localStorage.getItem("auth"));
    const accessSecret = auth.twitter.accessSecret;
    const accessToken = auth.twitter.accessToken;
    formData.append("image-file", this.state.selectedFile);
    // formData.append("accessSecret", auth.twitter.accessSecret);
    // formData.append("accessToken", auth.twitter.accessToken);
    let Data = JSON.stringify({ accessSecret, accessToken });
    formData.append("data", Data);
    axios.post("/api/twitter/file-upload", formData, {
      onUploadProgress: progressEvent => {
        console.log(progressEvent.loaded / progressEvent.total);
      }
    });
  };
  render() {
    const dateinput = this.state.checked ? (
      <div
        className=" d-flex justify-content-center mb-4 mt-4"
        style={{ width: "100%" }}
      >
        <Datetime
          onChange={this.onCheck}
          inputProps={{ placeholder: "Click here to set time duration" }}
        />
      </div>
    ) : null;
    let selectedfile;
    selectedfile =
      this.state.uploadedFileCloudinaryUrl !== null ? (
        <div className="card mt-4">
          <div className="card-header">Selected File</div>
          <div className="card-body">
            <div className="d-flex justify-content-around ">
              <div>
                <img
                  className="pr-4"
                  src={this.state.uploadedFileCloudinaryUrl}
                  alt="Selected File"
                  height="50"
                />
              </div>{" "}
              <div className="ml-4 d-flex justify-content-around align-items-center">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    this.setState({ uploadedFileCloudinaryUrl: null })
                  }
                >
                  delete
                  <i className="fas fa-times" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        (selectedfile = <div />)
      );
    const dropzoneStyle = {
      width: "80%",
      height: "30vh",
      border: "2px dashed #aeaeae",
      margin: "0px auto",
      borderRadius: "8px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    };
    return (
      <div>
        <Link to="/pages">
          {" "}
          <button type="button" className="btn btn-outline-info mb-4">
            Go back
          </button>
        </Link>
        <label htmlFor="file">
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
            name="image-file"
            className="upload-file"
            accept="image/*"
            id="file"
            onChange={this.fileChangedHandler}
            encType="multipart/form-data"
          />
        </label>
        <button onClick={this.uploadHandler}>Upload!</button>
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
              onChange={this.onPostChange}
              type="text"
              placeholder="Enter your post"
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
            </div>{" "}
            <div>
              <button
                type="button"
                className="btn btn-outline-secondary mr-3"
                onClick={this.onSubmitTwitter}
              >
                Twitter
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary mr-3"
                onClick={() =>
                  this.setState(prevState => ({
                    promptMedia: !prevState.promptMedia
                  }))
                }
              >
                <i className="fas fa-paperclip" />
              </button>
              <button type="submit" className="btn btn-outline-primary ">
                Post
              </button>
            </div>
          </div>
          {this.state.promptMedia ? (
            <Dropzone
              style={dropzoneStyle}
              multiple={false}
              accept="image/*"
              onDrop={this.onImageDrop.bind(this)}
            >
              <p>Drop an image or click to select a file to upload.</p>
            </Dropzone>
          ) : null}{" "}
        </form>
        {selectedfile}
        {dateinput}
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
