import React, { Component } from "react";
import { connect } from "react-redux";
import { registeruser } from "../../actions/authaction";
import { withRouter } from "react-router-dom";
import TextInput from "../common/textinput";
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      terms: false,
      errors: {}
    };
    this.handleinputchange = this.handleinputchange.bind(this);
  }
  componentDidMount() {
    if (this.props.auth.appAuth) {
      this.props.history.push("/");
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  handleinputchange(event) {
    let target = event.target;
    let field = target.name;
    let value = target.type === "checkbox" ? target.checked : target.value;
    this.setState({ [field]: value });
  }
  handleSubmit(event) {
    event.preventDefault();
    // var counter = 0;
    // if (this.state.name.length > 3) {
    //   counter++;
    //   const { password, ...state } = this.state.errors;
    //   this.setState({ errors: state });
    // } else {
    //   setTimeout(() => {
    //     this.setState({
    //       errors: {
    //         name: "name field is required"
    //       }
    //     });
    //   }, 0.2);
    // }

    // //pass eval
    // if (
    //   this.state.password.match(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/
    //   ) &&
    //   this.state.password === this.state.password2
    // ) {
    //   counter++;
    //   const { password, ...state } = this.state.errors;
    //   this.setState({ errors: state });
    // } else {
    //   setTimeout(() => {
    //     this.setState({
    //       errors: {
    //         password:
    //           "passwords should be atleast 8 aplhanumeric characters with one special character"
    //       }
    //     });
    //   }, 0.1);
    // }

    // //emailid eval
    // if (
    //   // eslint-disable-next-line
    //   /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/.test(this.state.email)
    // ) {
    //   counter++;
    //   const { email, ...state } = this.state.errors;

    //   this.setState({ errors: state });
    // } else {
    //   this.setState({
    //     errors: { email: "this.emailid" }
    //   });
    // }
    // if (this.state.terms) {
    //   counter++;
    // }
    // if (counter === 4) {

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    this.props.registeruser(newUser, this.props.history);
    //   counter = 0;
    // } else {
    //   counter = 0;
    // }
  }
  render() {
    const errors = this.state.errors;
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your account</p>
              <form onSubmit={this.handleSubmit.bind(this)}>
                <TextInput
                  value={this.state.name}
                  onChange={this.handleinputchange}
                  type="text"
                  error={errors.name}
                  placeholder="Name"
                  name="name"
                />
                <TextInput
                  value={this.state.email}
                  onChange={this.handleinputchange}
                  type="email"
                  error={errors.email}
                  placeholder="Email Address"
                  name="email"
                />
                <TextInput
                  value={this.state.password}
                  onChange={this.handleinputchange}
                  type="password"
                  error={errors.password}
                  placeholder="Enter Password"
                  name="password"
                />
                <TextInput
                  value={this.state.password2}
                  onChange={this.handleinputchange}
                  type="password"
                  error={errors.password2}
                  placeholder="Re-Enter Password"
                  name="password2"
                />
                <div className="row">
                  <label style={{ marginLeft: "20px" }}>
                    <input
                      autoComplete="given-name"
                      type="checkbox"
                      style={{ marginLeft: "20" }}
                      checked={this.state.terms}
                      onChange={this.handleinputchange}
                      name="terms"
                    />
                    <span>Accept the terms and conditions</span>
                  </label>
                </div>

                <input type="Submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    auth: state.auth,
    errors: state.error
  };
};
export default connect(
  mapStateToProps,
  { registeruser }
)(withRouter(Register));
