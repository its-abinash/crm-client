import React, { Component } from "react";
import "./index.css";
import lodash from "lodash";
import { AES } from "crypto-js";
import axios from "axios";
import CheckCircleSharpIcon from "@material-ui/icons/CheckCircleSharp";
import ErrorOutlineSharpIcon from "@material-ui/icons/ErrorOutlineSharp";
import Snackbar from "../components/Snackbar/Snackbar.js";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ShowNotifications: false,
      response_message: "",
      response_status: "danger",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      component: null,
    };
    this.onChange = this.onChange.bind(this);
    this.onSignUpHit = this.onSignUpHit.bind(this);
    this.getEncryptedValue = this.getEncryptedValue.bind(this);
    this.getEncryptedPayload = this.getEncryptedPayload.bind(this);
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

  async onSignUpHit(event) {
    event.preventDefault();
    var { firstname, lastname, email, password } = this.state;

    var payload = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
    };
    var encryptedPayload = this.getEncryptedPayload(payload);
    var finalPayload = { payload: encryptedPayload };
    var callOptions = {
      method: "POST",
      url: "http://localhost:3001/register",
      timeout: 60 * 1000,
      data: finalPayload,
    };

    try {
      var result = await axios(callOptions);
    } catch (exc) {
      result = exc?.response;
    }
    if (result && result.data) {
      var statusCode = result.data.statusCode;
      var message = result.data.reasons[0] || "Failed to register";
      if (statusCode >= 200 && statusCode < 300) {
        message = "Successfully Registered. Thank you for joining us!";
      }
      this.setState({
        ShowNotifications: true,
        response_status:
          statusCode >= 200 && statusCode < 300 ? "success" : "danger",
        response_message: message,
      });
    } else {
      this.setState({
        response_status: "danger",
        response_message: "Server is not reachable",
      });
    }
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

  render() {
    return (
      <>
        <div className="auth-wrapper"> {this.state.component} </div>
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

export default SignUp;
