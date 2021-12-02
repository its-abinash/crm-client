import React, { Component } from "react";
import "./index.css";
import Cookies from "universal-cookie";
import lodash from "lodash";
import {
  RESTService,
  encUtil,
  NotificationUtil,
} from "../main_utils/main_utils";
const cookies = new Cookies();

class Login extends Component {
  constructor(props) {
    super(props);
    this._notificationUtil = null;
    this.state = {
      email: "",
      password: "",
      login_component: null,
    };
    this.OnLoginHit = this.OnLoginHit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getLoginComponent = this.getLoginComponent.bind(this);
    this.showNotification = this.showNotification.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async processAndSendRequest(options) {
    var result = await RESTService.makeRequest(options);
    if (result.checkValidResponse()) {
      var values = result.getValuesFromResponse();
      var statusCode = result.getStatusCode();
      if (statusCode === 200 && values[0].auth) {
        // Caching user data
        cookies.set("userId", this.state.email);
        cookies.set("password", encUtil.getEncryptedValue(this.state.password));
        cookies.set(
          "x-access-token",
          encUtil.getEncryptedValue(values[0].token)
        );

        this.props.history.push({
          pathname: "/admin",
          user: this.state.email,
          data: values[0],
        });
      }
    }
    var responseId = result.getResponseId();
    var notificationType = result.getNotificationType();
    var respId = lodash.isEmpty(responseId) ? "DEFAULT" : responseId;
    var translateCodes = result.getTranslateCodes();
    this._notificationUtil = new NotificationUtil(
      notificationType,
      respId,
      translateCodes
    );
    this.showNotification();
  }

  OnLoginHit(event) {
    event.preventDefault();
    const { email, password } = this.state;
    var payload = {
      email: email,
      password: password,
    };
    var encryptedPayload = encUtil.encryptPayload(payload);
    var finalPayload = { payload: encryptedPayload };
    var callOptions = {
      method: "POST",
      url: "http://localhost:3001/login",
      timeout: 60 * 1000,
      data: finalPayload,
    };
    this.processAndSendRequest(callOptions);
  }

  getLoginComponent() {
    var loginComponent = (
      <div className="auth-inner">
        <form onSubmit={this.OnLoginHit}>
          <h3>Sign In</h3>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter email"
              onChange={this.onChange}
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              onChange={this.onChange}
              required
            />
          </div>

          <div className="form-group">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Remember me
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Submit
          </button>
          <p className="have-account text-left">
            Don't have an account?{" "}
            <a href="http://localhost:3000/sign-up">create one</a>
          </p>
          <p className="forgot-password text-right">
            Forgot <a href="http://localhost:3000">password?</a>
          </p>
        </form>
      </div>
    );
    this.setState({ login_component: loginComponent });
  }

  showNotification() {
    this._notificationUtil && this._notificationUtil.notify();
  }

  componentDidMount() {
    this.getLoginComponent();
  }
  render() {
    return (
      <>
        <div className="auth-wrapper">{this.state.login_component} </div>
      </>
    );
  }
}

export default Login;
