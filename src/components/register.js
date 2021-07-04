import React, { Component } from "react";
import "./index.css";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginResponse: {},
      email: "",
      password: "",
      userAuthorized: false,
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  render() {
    return (
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form>
            <h3>Sign Up</h3>

            <div className="form-group">
              <label>First name</label>
              <input
                type="text"
                className="form-control"
                placeholder="First name"
                onChange={this.onChange}
              />
            </div>

            <div className="form-group">
              <label>Last name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Last name"
                onChange={this.onChange}
              />
            </div>

            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                onChange={this.onChange}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                onChange={this.onChange}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Sign Up
            </button>
            <p className="forgot-password text-right">
              Already registered <a href="http://localhost:3000">sign in?</a>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default SignUp;
