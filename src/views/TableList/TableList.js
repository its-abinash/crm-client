import { lazy, Suspense } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import React, { Component } from "react";
import SendIcon from "@material-ui/icons/Send";
import Alert from "@material-ui/lab/Alert";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import AlertTitle from "@material-ui/lab/AlertTitle";
import CheckCircleSharpIcon from "@material-ui/icons/CheckCircleSharp";
import ErrorOutlineSharpIcon from "@material-ui/icons/ErrorOutlineSharp";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import HttpsIcon from "@material-ui/icons/HttpsOutlined";
import Snackbar from "../../components/Snackbar/Snackbar.js";
import {
  withStyles,
  ThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles";
import { blue, green } from "@material-ui/core/colors";
import { AES, enc } from "crypto-js";
import axios from "axios";
import lodash from "lodash";
import ChatModal from "../../components/chat.js";
import Cookies from "universal-cookie";
import spinner from "../../assets/loading.gif";

const LoadProfileCards = lazy(() => import("./profileCard"));
const SearchBox = lazy(() => import("./searchBox"));

const cookies = new Cookies();

const useStyles = (theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  img: {
    justifyContent: "space-between",
  },
});

const divStyle = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  alignContent: "flex-start",
  scroll: "auto",
  overflowX: "hidden",
  overflowY: "auto",
  height: window.innerHeight,
};

const loadingIconDiv = {
  display: "block",
  textAlign: "center",
  height: window.innerHeight,
};

const deleteBtnStyle = { backgroundColor: "red" };

const ButtonTheme = createMuiTheme({
  palette: {
    primary: green,
    secondary: blue,
  },
});

const IconMap = {
  success: CheckCircleSharpIcon,
  danger: ErrorOutlineSharpIcon,
  warning: HttpsIcon,
};

function EmailModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        {props.loadingicon === "true" ? (
          <CircularProgress />
        ) : (
          <Alert severity="info" style={{ width: "100%" }}>
            <AlertTitle>Info</AlertTitle>
            An e-mail will be sent to our client —{" "}
            <strong>{props.username}</strong>
          </Alert>
        )}
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formGridEmail">
            <Form.Label>To</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={props.user}
              readOnly
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Subject</Form.Label>
            <Form.Control
              placeholder="Enter Email Subject"
              name="email_subject"
              id="email_subject"
              onChange={props.onChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Body</Form.Label>
            <Form.Control
              as="textarea"
              name="email_body"
              id="email_body"
              rows={5}
              onChange={props.onChange}
            />
          </Form.Group>

          <ThemeProvider theme={ButtonTheme}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SendIcon />}
              onClick={props.onSubmit}
            >
              Send
            </Button>
          </ThemeProvider>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

function DeleteModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Alert severity="warning" style={{ width: "100%" }}>
          <AlertTitle>Warning</AlertTitle>
          You are attempting to delete our client -{" "}
          <strong> {props.username} </strong>. Please go back if not necessary.
        </Alert>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Row className="align-items-center">
            <Col sm={3} className="warning-message">
              Are you sure on this?
            </Col>
            <Col sm={3} className="checkbox">
              <Form.Check
                type="checkbox"
                label="Check here to proceed"
                name="isChecked"
                onChange={props.onChange}
              />
            </Col>
            <Col className="delete-user-btn">
              <Button
                variant="contained"
                style={deleteBtnStyle}
                startIcon={<DeleteForeverIcon />}
                disabled={!props.isChecked}
                // onClick={props.onSubmit} -- TODO --
              >
                Delete {props.username}
              </Button>
            </Col>
          </Form.Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_admin: "",
      ShowNotifications: false,
      DeleteModalShow: false,
      EmailModalShow: false,
      user_of_activated_modal: "",
      username_of_activated_modal: "",
      image_of_activated_modal:
        "https://www.w3schools.com/howto/img_avatar.png",
      ChatModalShow: false,
      clients: [],
      users_component: [],
      access_token: null,
      logged_in_user: cookies.get("userId") || "",
      email_subject: "",
      email_body: "",
      loading: "false",
      response_status: "",
      response_message: "",
      isChecked: false,
    };
    this.DecryptKey = this.DecryptKey.bind(this);
    this.GetHeaders = this.GetHeaders.bind(this);
    this.ProcessAndGetUsers = this.ProcessAndGetUsers.bind(this);
    this.GetUserType = this.GetUserType.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onEmailSubmit = this.onEmailSubmit.bind(this);
    this.getEncryptedPayload = this.getEncryptedPayload.bind(this);
    this.getEncryptedValue = this.getEncryptedValue.bind(this);
  }

  onChange(event) {
    if (event.target.name === "isChecked") {
      this.setState({ [event.target.name]: event.target.checked });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
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

  DecryptKey(key) {
    var wordArray = AES.decrypt(key, "#");
    var utf8String = wordArray.toString(enc.Utf8);
    try {
      var obj = JSON.parse(utf8String);
      return obj;
    } catch (exc) {
      return utf8String;
    }
  }

  GetHeaders() {
    const token = cookies.get("x-access-token");
    if (!token) {
      return {};
    }
    this.setState({ access_token: this.DecryptKey(token) });
    var headers = {
      "x-access-token": this.DecryptKey(token),
    };
    return headers;
  }

  async GetUserType() {
    if (!lodash.isEmpty(this.state.is_admin)) {
      return;
    }
    const options = {
      method: "GET",
      url: "http://localhost:3001/getUserType",
      timeout: 60 * 1000,
      headers: this.GetHeaders(),
    };
    try {
      var result = await axios(options);
    } catch (exc) {
      result = exc?.response;
    }
    this.setState({ is_admin: result.data.values[0] ? "true" : "false" });
  }

  async ProcessAndGetUsers(searchText) {
    await this.GetUserType();
    var userType = this.state.is_admin === "true" ? false : true;
    const qpArgs = this.getEncryptedValue(
      `admin=${userType}&searchText=${searchText}`,
      "#"
    );
    const URL = `http://localhost:3001/dashboard/users?${qpArgs}`;
    const options = {
      method: "GET",
      url: URL,
      timeout: 60 * 1000,
      headers: this.GetHeaders(),
    };
    try {
      var result = await axios(options);
    } catch (exc) {
      result = exc?.response;
    }
    if (result.data.statusCode === 401) {
      this.setState({ response_status: "danger" });
      this.setState({ ShowNotifications: true });
      this.setState({
        response_message: "You are not authorized to access this page",
      });
      return;
    }
    this.setState({
      clients: result.data.values,
    });
  }

  async onEmailSubmit(event) {
    event.preventDefault();
    const { user_of_activated_modal, email_body, email_subject } = this.state;
    var payload = {
      email: user_of_activated_modal,
      subject: this.getEncryptedValue(email_subject, "#"),
      body: this.getEncryptedValue(email_body, "#"),
    };
    var encryptedPayload = this.getEncryptedPayload(payload);
    var finalPayload = { payload: encryptedPayload };
    var callOptions = {
      method: "POST",
      url: "http://localhost:3001/email",
      headers: this.GetHeaders(),
      timeout: 60 * 1000,
      data: finalPayload,
    };
    try {
      var result = await axios(callOptions);
      this.setState({
        response_status: "success",
        response_message: result.data.reasons[0],
        ShowNotifications: true,
      });
    } catch (exc) {
      result = exc?.response;
      this.setState({
        response_status: "danger",
        response_message: result.data.reasons[0],
        ShowNotifications: true,
      });
    }
  }

  async GetUserData(searchText) {
    await this.ProcessAndGetUsers(searchText);
    var userData = this.state.clients;
    const { classes } = this.props;
    var users_list_component = userData.map((data) => {
      return (
        <Suspense fallback={<div>Loading...</div>} key={data.email}>
          <LoadProfileCards
            classes={classes}
            data={data}
            onClickChatBtn={() => {
              this.setState({ ChatModalShow: true });
              this.setState({ user_of_activated_modal: data.email });
              this.setState({ username_of_activated_modal: data.name });
              this.setState({ image_of_activated_modal: data.image });
            }}
            onClickEmailBtn={() => {
              this.setState({ EmailModalShow: true });
              this.setState({ user_of_activated_modal: data.email });
              this.setState({ username_of_activated_modal: data.name });
            }}
            onClickDeleteBtn={() => {
              this.setState({ DeleteModalShow: true });
              this.setState({ user_of_activated_modal: data.email });
              this.setState({ username_of_activated_modal: data.name });
            }}
          />
        </Suspense>
      );
    });
    this.setState({
      users_component: users_list_component,
      loading: "false",
    });
  }

  componentDidMount() {
    this.setState({ loading: "true" })
    this.GetUserData(""); // Empty searchText represents to get all users for the loggedInUser
  }

  render() {
    return (
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <SearchBox
            callback={this}
            onChange={() => this.setState({ loading: "true" })}
          />
        </Suspense>
        {this.state.loading === "true" && (
          <div style={loadingIconDiv}>
            <img src={spinner} alt="loading..." />
          </div>
        )}
        <div style={divStyle}>
          {this.state.users_component}
          <EmailModal
            loadingicon={this.state.loading}
            onSubmit={this.onEmailSubmit}
            subject={this.state.email_subject}
            body={this.state.email_body}
            onChange={this.onChange}
            user={this.state.user_of_activated_modal}
            username={this.state.username_of_activated_modal}
            show={this.state.EmailModalShow}
            onHide={() => this.setState({ EmailModalShow: false })}
          />
          <ChatModal
            user={this.state.user_of_activated_modal}
            username={this.state.username_of_activated_modal}
            logged_in_user={this.state.logged_in_user}
            image={this.state.image_of_activated_modal}
            show={this.state.ChatModalShow}
            get_headers={this.GetHeaders}
            get_encrypted_value={this.getEncryptedValue}
            get_encrypted_payload={this.getEncryptedPayload}
            get_decrypted_key={this.DecryptKey}
            onHide={() => this.setState({ ChatModalShow: false })}
          />
          <DeleteModal
            user={this.state.user_of_activated_modal}
            username={this.state.username_of_activated_modal}
            show={this.state.DeleteModalShow}
            onChange={this.onChange}
            isChecked={this.state.isChecked}
            onHide={() => this.setState({ DeleteModalShow: false })}
          />
          {this.state.ShowNotifications ? (
            <Snackbar
              color={this.state.response_status}
              icon={IconMap[this.state.response_status]}
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
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(TableList);
