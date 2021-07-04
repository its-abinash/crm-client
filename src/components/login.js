import CheckCircleSharpIcon from "@material-ui/icons/CheckCircleSharp";
import ErrorOutlineSharpIcon from "@material-ui/icons/ErrorOutlineSharp";
import Snackbar from "../components/Snackbar/Snackbar.js";
import React, { Component } from "react";
import "./index.css";
import { AES, enc } from "crypto-js";
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginResponse: {},
      email: "",
      password: "",
      userAuthorized: false,
      ShowNotifications: false,
      response_message: "",
      response_status: "",
      login_component: null,
    };
    this.OnLoginHit = this.OnLoginHit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getLoginComponent = this.getLoginComponent.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  getEncryptedValue(key, ENCRYPTION_KEY) {
    var encrypted = AES.encrypt(JSON.stringify(key), ENCRYPTION_KEY).toString();
    // Converting into base64 string
    var wordArray = enc.Utf8.parse(String(encrypted));
    encrypted = enc.Base64.stringify(wordArray).toString();
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
    this.setState({ ShowNotifications: true });
    if (result.data.statusCode === 200 && result.data.values[0].auth) {
      this.setState({ loginResponse: result.data.values[0] });
      this.setState({
        response_status: result.data.statusCode === 200 ? "success" : "danger",
      });
      this.setState({ response_message: result.data.reasons[0] });
      cookies.set("userId", this.state.email);
      cookies.set("password", this.getEncryptedValue(this.state.password, "#"));
      cookies.set(
        "x-access-token",
        this.getEncryptedValue(result.data.values[0].token, "#")
      );
      this.setState({ userAuthorized: true });
      this.props.history.push({
        pathname: "/admin",
        user: this.state.email,
        data: this.state.loginResponse,
      });
    } else {
      this.setState({ response_status: "danger" });
      this.setState({ response_message: result.data.reasons[0] });
    }
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

  componentDidMount() {
    this.getLoginComponent();
  }
  render() {
    return (
      <>
        <div className="auth-wrapper">{this.state.login_component}</div>
        {this.state.ShowNotifications ? (
          <Snackbar
            color={this.state.response_status}
            icon={
              this.state.response_status === "success"
                ? CheckCircleSharpIcon
                : ErrorOutlineSharpIcon
            }
            message={this.state.response_message}
            open={this.state.ShowNotifications}
            closeNotification={() =>
              this.setState({ ShowNotifications: false })
            }
            close
          />
        ) : (
          ""
        )}
      </>
    );
  }
}

export default Login;
