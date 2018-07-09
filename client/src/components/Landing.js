import React, { Component } from "react";
export default class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onChange = date => this.setState({ date });
  render() {
    return <div style={{ height: "70vh" }}>Landing</div>;
  }
}
