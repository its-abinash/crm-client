import { pushNotification } from "./Snackbar/toastUtils";
import React, { Component } from "react";
import "./index.css";
import { AES } from "crypto-js";
import axios from "axios";
import Cookies from "universal-cookie";
import lodash from "lodash";
const cookies = new Cookies();

const STATUS_LIST_TO_SHOW_REASON = [400, 422];

class Login extends Component {
  constructor(props) {
    super(props);
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

  getEncryptedValue(key, ENCRYPTION_KEY) {
    var encrypted = "";
    if (lodash.isObject(key)) {
      encrypted = AES.encrypt(JSON.stringify(key), ENCRYPTION_KEY).toString();
    } else {
      encrypted = AES.encrypt(String(key), ENCRYPTION_KEY).toString();
    }
    return encrypted;
  }

  getEncryptedPayload = function (payload) {
    payload = this.getEncryptedValue(payload, "#");
    return payload;
  };

  async processAndSendRequest(options) {
    try {
      var result = await axios(options);
    } catch (exc) {
      result = exc?.response;
    }
    var notificationType = "error";
    var notificationMessage = "Server is not reachable";
    if (result && result.data) {
      if (result.data.statusCode === 200 && result.data.values[0].auth) {
        notificationType = result.data.statusCode === 200 ? "success" : "error";
        notificationMessage = result.data.reasons[0];
        // Caching user data
        cookies.set("userId", this.state.email);
        cookies.set(
          "password",
          this.getEncryptedValue(this.state.password, "#")
        );
        cookies.set(
          "x-access-token",
          this.getEncryptedValue(result.data.values[0].token, "#")
        );

        this.props.history.push({
          pathname: "/admin",
          user: this.state.email,
          data: result.data.values[0],
        });
      } else {
        if (lodash.includes(STATUS_LIST_TO_SHOW_REASON, result.data.statusCode)) {
          notificationMessage = result.data.reasons[0];
        } else {
          var status = result.data.status.split("_").join(" ");
          notificationMessage = status
        }
      }
    }
    this.showNotification(notificationType, notificationMessage);
  }

  OnLoginHit(event) {
    event.preventDefault();
    const { email, password } = this.state;
    var payload = {
      email: email,
      password: password,
    };
    var encryptedPayload = this.getEncryptedPayload(payload);
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

  showNotification(notificationType, message) {
    pushNotification({
      type: notificationType,
      message: message,
    });
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
