import React, { Component } from "react";
import "./index.css";
import {
  RESTService,
  encUtil,
  NotificationUtil,
} from "../main_utils/main_utils";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      component: null,
    };
    this._notificationUtil = null;
    this.onChange = this.onChange.bind(this);
    this.onSignUpHit = this.onSignUpHit.bind(this);
    this.showNotification = this.showNotification.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async onSignUpHit(event) {
    event.preventDefault();
    var { firstname, lastname, email, password } = this.state;

    var payload = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
    };
    var encryptedPayload = encUtil.encryptPayload(payload);
    var finalPayload = { payload: encryptedPayload };
    var callOptions = {
      method: "POST",
      url: "http://localhost:3001/register",
      timeout: 60 * 1000,
      data: finalPayload,
    };
    var result = await RESTService.makeRequest(callOptions);
    this._notificationUtil = new NotificationUtil(
      result.getNotificationType(),
      result.getResponseId(),
      result.getTranslateCodes()
    );
    this.showNotification();
  }

  getRegisterComponent() {
    var registerComponent = (
      <div className="auth-inner">
        <form onSubmit={this.onSignUpHit}>
          <h3>Sign Up</h3>

          <div className="form-group">
            <label>First name</label>
            <input
              type="text"
              className="form-control"
              placeholder="First name"
              name="firstname"
              onChange={this.onChange}
            />
          </div>

          <div className="form-group">
            <label>Last name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Last name"
              name="lastname"
              onChange={this.onChange}
            />
          </div>

          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              name="email"
              onChange={this.onChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              name="password"
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
    );
    this.setState({ component: registerComponent });
  }

  componentDidMount() {
    this.getRegisterComponent();
  }

  showNotification() {
    this._notificationUtil && this._notificationUtil.notify();
  }

  render() {
    return (
      <>
        <div className="auth-wrapper"> {this.state.component} </div>
      </>
    );
  }
}

export default SignUp;
