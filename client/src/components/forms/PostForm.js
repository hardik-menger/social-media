import React, { Component } from "react";
import { connect } from "react-redux";
class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: "",
      errors: {},
      image: ""
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(e) {
    e.preventDefault();

    const userData = {
      post: this.state.post
    };
    this.props.pages.pageArray.length === 0
      ? alert("Please select atleast one page")
      : this.props.pages.pageArray.map(post =>
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
                    console.log(res);
                    alert("Error occured");
                  } else {
                    console.log("Post ", res);
                  }
                }
              );
            } else {
              alert("Post Unsuccessfull Login again");
            }
          })
        );
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  // dataURItoBlob(dataURI) {
  //   var byteString = atob(dataURI.split(",")[1]);
  //   var ab = new ArrayBuffer(byteString.length);
  //   var ia = new Uint8Array(ab);
  //   for (var i = 0; i < byteString.length; i++) {
  //     ia[i] = byteString.charCodeAt(i);
  //   }
  //   return new Blob([ab], {
  //     type: "image/png"
  //   });
  // }
  // handleChangeImage = evt => {
  //   var reader = new FileReader();
  //   var file = evt.target.files[0];

  //   reader.onload = upload => {
  //     this.setState(
  //       {
  //         image: upload.target.result
  //       },
  //       () => {
  //         console.log(this.state.image);
  //         this.uploadImageToPage(this.state.image);
  //       }
  //     );
  //   };
  //   reader.readAsDataURL(file);
  // };
  // handleChangeImage = evt => {
  //   var reader = new FileReader();
  //   var file = evt.target.files[0];

  //   reader.onload = upload => {
  //     this.setState(
  //       {
  //         image: upload.target.result
  //       },
  //       () => {
  //         this.dataURItoBlob();
  //       }
  //     );
  //   };
  //   reader.readAsDataURL(file);
  // };

  // dataURItoBlob() {
  //   var byteString = atob(this.state.image.split(",")[1]);
  //   var ab = new ArrayBuffer(byteString.length);
  //   var ia = new Uint8Array(ab);
  //   for (var i = 0; i < byteString.length; i++) {
  //     ia[i] = byteString.charCodeAt(i);
  //   }
  //   console.log(
  //     new Blob([ab], {
  //       type: "image/png"
  //     })
  //   );
  //   return new Blob([ab], {
  //     type: "image/png"
  //   });
  // }

  // uploadImageToPage = url => {
  //   try {
  //     var blob = this.dataURItoBlob();
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   var fd = new FormData();
  //   fd.append("access_token", this.props.auth.user.authResponse.accessToken);
  //   fd.append("source", blob);
  //   fd.append("message", "Photo Text");
  //   console.log(fd);
  //   window.FB.api(
  //     `/338965349971960/photos?access_token=${
  //       this.props.auth.user.authResponse.accessToken
  //     }`,
  //     "post",
  //     {
  //       message: "photo description",
  //       source: fd
  //     },
  //     response => {
  //       if (!response || response.error) {
  //         console.log("Error occured", response.error);
  //       } else {
  //         alert("Post ID: " + response.id);
  //       }
  //     },
  //     {
  //       scope: "pages_manage_cta,pages_show_list,publish_pages,manage_pages"
  //     }
  //   );
  //   // this.props.pages.pageArray.length === 0
  //   //   ? alert("Please select atleast one page")
  //   //   : this.props.pages.pageArray.map(
  //   //       post =>
  //   //         window.FB.api(
  //   //           `/${post.id}/photos?access_token=${
  //   //             this.props.auth.user.authResponse.accessToken
  //   //           }`,
  //   //           "post",
  //   //           {
  //   //             message: "photo description",
  //   //             source:
  //   //               "https://i1.wp.com/gorigins.com/wp/wp-content/uploads/2016/02/Post-HTML5-Canvas-Image-on-Facebook-and-Twitter_panda.png?w=282"
  //   //           },
  //   //           response => {
  //   //             if (!response || response.error) {
  //   //               console.log("Error occured", response.error);
  //   //             } else {
  //   //               alert("Post ID: " + response.id);
  //   //             }
  //   //           },
  //   //           {
  //   //             scope:
  //   //               "pages_manage_cta,pages_show_list,publish_pages,manage_pages"
  //   //           }
  //   //         )
  //   //       // window.FB.getLoginStatus(response => {
  //   //       //   if (response.status === "connected") {
  //   //       //   } else {
  //   //       //     alert("Post Unsuccessfull Login again");
  //   //       //   }
  //   //       // })
  //   //     );
  // };
  imageuploadtrythree = e => {
    e.preventDefault();

    // Get file object from file input
    var file = this.refs.file.files[0];

    // If file is selected
    if (file) {
      // We will use FileReader
      var reader = new FileReader();

      // And and onload callback when file data loaded
      reader.onload = e => {
        console.log(e, reader, file);
        // This is array buffer of the file
        var arrayBuffer = e.target.result;

        // And blob object of the file
        var blob = new Blob([arrayBuffer], { type: file.type });

        // We will use FormData object to create multipart/form request
        // var data = new FormData();
        // data.append("access_token", "window.FB.getAccessToken()");
        // data.append("source", blob);
        // data.append("message", "try 3");
        // var access_token = this.props.auth.axios;
        // var source = blob;
        // var message = "try 3";
        var wallPost = {
          message: "Test to post a photo",
          src: blob,
          access_token: this.props.auth.user.authResponse.accessToken
        };
        window.FB.api(`/me/feed`, "post", wallPost, function(response) {
          if (!response || response.error) {
            console.log("Failure! ", response.error.message);
          } else {
            alert("Success! Post ID: " + response);
          }
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
            <label style={{ fileInput }}>
              Upload
              <input
                ref="file"
                type="file"
                name="file"
                className="upload-file"
                id="file"
                onChange={this.imageuploadtrythree}
                encType="multipart/form-data"
              />
            </label>
            {/* <button type="button" onClick={this.uploadImageToPage}>
              upload
            </button> */}
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
