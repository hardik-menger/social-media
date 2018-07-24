import React, { Component } from "react";
import { Link } from "react-router-dom";
export default class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div style={{ height: "70vh" }}>
        <div className="jumbotron jumbotron-fluid">
          <div className="container-fluid ">
            <h1 className="display-4">Name goes here</h1>
            <p className="lead">
              This is a modified jumbotron that occupies the entire horizontal
              space of its parent.
            </p>
            <hr className="my-4" />
            <p>
              It uses utility classes for typography and spacing to space
              content out within the larger container.
            </p>
            <p className="lead">
              <Link to="/pages">Add profiles</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
