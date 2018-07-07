import React, { Component } from "react";

export default class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: ""
    };
  }

  render() {
    return (
      <div style={{ height: "70vh" }}>
        Landing
        <input
          ref="file"
          type="file"
          name="file"
          className="upload-file"
          id="file"
          onChange={this.handleChangeImage}
          encType="multipart/form-data"
          required
        />
      </div>
    );
  }
}
