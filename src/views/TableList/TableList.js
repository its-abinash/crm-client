import { lazy, Suspense } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import React, { Component } from "react";
import SendIcon from "@material-ui/icons/Send";
import Alert from "@material-ui/lab/Alert";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import AlertTitle from "@material-ui/lab/AlertTitle";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  withStyles,
  ThemeProvider,
  createTheme,
} from "@material-ui/core/styles";
import { blue, green } from "@material-ui/core/colors";
import lodash from "lodash";
import ChatModal from "../../components/chat.js";
import Cookies from "universal-cookie";
import spinner from "../../assets/loading.gif";
import SpinnerIcon from "react-bootstrap/Spinner";
import {
  RESTService,
  encUtil,
  NotificationUtil,
} from "../../main_utils/main_utils";

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
  height: window.innerHeight,
};

const loadingIconDiv = {
  display: "block",
  textAlign: "center",
  height: window.innerHeight,
};

const deleteBtnStyle = { backgroundColor: "red" };

const ButtonTheme = createTheme({
  palette: {
    primary: green,
    secondary: blue,
  },
});

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
    this._notificationUtil = null;
    this.state = {
      is_admin: "",
      DeleteModalShow: false,
      EmailModalShow: false,
      user_of_activated_modal: "",
      username_of_activated_modal: "",
      image_of_activated_modal: null,
      ChatModalShow: false,
      clients: [],
      users_component: [],
      access_token: null,
      logged_in_user: cookies.get("userId") || "",
      email_subject: "",
      email_body: "",
      loading: "false",
      isChecked: false,
      hasMore: true,
      offset: 0,
      limit: 5,
    };
    this.GetHeaders = this.GetHeaders.bind(this);
    this.ProcessAndGetUsers = this.ProcessAndGetUsers.bind(this);
    this.GetUserType = this.GetUserType.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onEmailSubmit = this.onEmailSubmit.bind(this);
    this.showNotification = this.showNotification.bind(this);
  }

  onChange(event) {
    if (event.target.name === "isChecked") {
      this.setState({ [event.target.name]: event.target.checked });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  }

  GetHeaders() {
    const token = cookies.get("x-access-token");
    if (!token) {
      return {};
    }
    this.setState({ access_token: encUtil.DecryptKey(token) });
    var headers = {
      "x-access-token": encUtil.DecryptKey(token),
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
    var result = await RESTService.makeRequest(options);
    var values = result.getValuesFromResponse();
    this.setState({ is_admin: values[0] ? "true" : "false" });
  }

  async ProcessAndGetUsers(searchText = "") {
    await this.GetUserType();
    var userType = this.state.is_admin === "true" ? false : true;
    const qpArgs = encUtil.getEncryptedValue(
      `admin=${userType}&searchText=${searchText}&limit=${this.state.limit}&offset=${this.state.offset}`,
      "#"
    );
    const URL = `http://localhost:3001/dashboard/users?${qpArgs}`;
    const options = {
      method: "GET",
      url: URL,
      timeout: 60 * 1000,
      headers: this.GetHeaders(),
    };
    var result = await RESTService.makeRequest(options);
    var statusCode = result.getStatusCode();
    var values = result.getValuesFromResponse();
    var respId = result.getResponseId();
    var translateCodes = result.getTranslateCodes();
    if (statusCode === 401) {
      this._notificationUtil = new NotificationUtil(
        result.getNotificationType(),
        respId,
        translateCodes
      );
      this.showNotification();
      return;
    }
    if (lodash.isEmpty(values)) {
      this.setState({ hasMore: false });
      return;
    }
    this.setState({
      clients: !lodash.isEmpty(searchText)
        ? values
        : this.state.clients.concat(values),
      offset: lodash.isEmpty(searchText)
        ? this.state.offset + this.state.limit
        : 0,
    });
  }

  async onEmailSubmit(event) {
    event.preventDefault();
    const { user_of_activated_modal, email_body, email_subject } = this.state;
    var payload = {
      email: user_of_activated_modal,
      subject: encUtil.getEncryptedValue(email_subject, "#"),
      body: encUtil.getEncryptedValue(email_body, "#"),
    };
    var encryptedPayload = encUtil.encryptPayload(payload);
    var finalPayload = { payload: encryptedPayload };
    var callOptions = {
      method: "POST",
      url: "http://localhost:3001/email",
      headers: this.GetHeaders(),
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

  async GetUserData(searchText = "") {
    await this.ProcessAndGetUsers(searchText);
    this.setState({ loading: "false" });
  }

  componentDidMount() {
    this.setState({ loading: "true" });
    this.GetUserData(""); // Empty searchText represents to get all users for the loggedInUser
  }

  showNotification() {
    this._notificationUtil && this._notificationUtil.notify();
  }

  render() {
    return (
      <div style={{ filter: "blur('8px')" }}>
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

        <InfiniteScroll
          dataLength={this.state.clients.length}
          next={this.ProcessAndGetUsers}
          hasMore={this.state.hasMore}
          loader={<SpinnerIcon animation="border" />}
          height={600}
        >
          <div style={divStyle}>
            {this.state.clients.map((data) => (
              <Suspense fallback={<div>Loading...</div>} key={data.email}>
                <LoadProfileCards
                  classes={this.props.classes}
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
            ))}
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
              get_encrypted_value={encUtil.getEncryptedValue}
              get_encrypted_payload={this.getEncryptedPayload}
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
          </div>
        </InfiniteScroll>
      </div>
    );
  }
}

export default withStyles(useStyles)(TableList);
