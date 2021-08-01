import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import "../assets/css/chat.css";
import { Form, Col } from "react-bootstrap";
import SendIcon from "@material-ui/icons/Send";
import AttachmentIcon from "@material-ui/icons/Attachment";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { cyan } from "@material-ui/core/colors";
import axios from "axios";
import * as socketAPI from "../components/socket";
import lodash from "lodash";

const ButtonTheme = createMuiTheme({
  palette: {
    primary: cyan,
  },
});

const ChatContainerStyle = {
  height: "450px",
  overflowX: "hidden",
  overflowY: "auto",
  backgroundRepeat: `repeat`,
  backgroundImage: `url("https://i.pinimg.com/originals/4a/96/e6/4a96e602750b8ef669a77565becf3939.gif")`,
  backgroundBlendMode: "lighten",
};

class ChatModal extends Component {
  _isMounted = false;
  _init_rendering = false; // This is to ensure that the loadChat has been
  // called once per page refresh to load the chat once in beginning

  constructor(props) {
    super(props);
    this.state = {
      chat_message: "",
      received_msgs: [],
      chat_comp: [],
    };
    this.sendChat = this.sendChat.bind(this);
    this.onChange = this.onChange.bind(this);
    this.makeRequest = this.makeRequest.bind(this);
    this.getPrevChatDataCallOptions =
      this.getPrevChatDataCallOptions.bind(this);
    this.encryptKeyStable = this.encryptKeyStable.bind(this);
    this.loadChat = this.loadChat.bind(this);
  }

  async makeRequest(callOptions) {
    try {
      var result = await axios(callOptions);
    } catch (exc) {
      result = exc?.response;
    }
    return result;
  }

  sendChat(event) {
    event.preventDefault();
    document.getElementById("chat-input-id").value = "";
    var payload = {
      receiver: this.props.user,
      chatmsg: this.props.get_encrypted_value(this.state.chat_message, "#"),
      timestamp: Date.now(),
    };
    var encryptedPayload = this.props.get_encrypted_payload(payload);
    var finalPayload = { payload: encryptedPayload };
    var callOptions = {
      method: "POST",
      url: "http://localhost:3001/chat",
      headers: this.props.get_headers(),
      timeout: 60 * 1000,
      data: finalPayload,
    };
    this.makeRequest(callOptions);
  }

  onChange(event) {
    this.setState({ chat_message: event.target.value });
  }

  encryptKeyStable(key) {
    // This function encrypts key by ensuring that the encrypted key must remain same
    // if the same key is encrypted again by this function
    var encryptedKey = Buffer.from(String(key)).toString("base64");
    return encryptedKey;
  }

  getPrevChatDataCallOptions() {
    var receiver = this.encryptKeyStable(this.props.user);
    var sender = this.encryptKeyStable(this.props.logged_in_user);
    if (receiver === "" || sender === "") {
      return {};
    }
    const finalURL = `http://localhost:3001/chat/receivers/${receiver}/senders/${sender}`;
    var callOptions = {
      method: "GET",
      url: finalURL,
      headers: this.props.get_headers(),
      timeout: 60 * 1000,
    };
    return callOptions;
  }

  async loadChat() {
    var callOptions = this.getPrevChatDataCallOptions();
    if (lodash.isEmpty(callOptions)) {
      return;
    }
    var result = await axios(callOptions);
    var prev_received_msgs = this.state.received_msgs;
    var curr_received_msgs = result.data.values;
    var unionOfCommonReceivedMessages = lodash.uniqBy(
      [...prev_received_msgs, ...curr_received_msgs],
      "timestamp"
    );
    var messages = lodash.sortBy(unionOfCommonReceivedMessages, ["timestamp"]);
    var chatComp = messages.map((data, index) => {
      return (
        <div key={index}>
          {data.sender === this.props.user && (
            <div className="container">
              {console.log(data.image)}
              <img src={data.image} alt="Avatar" className="right" />
              <p style={{ textAlign: "left" }}>{data.chatmsg}</p>
              <span className="time-left">
                {new Date(data.timestamp).toLocaleString()}
              </span>
            </div>
          )}
          {data.sender === this.props.logged_in_user &&
            data.receiver === this.props.user && (
              <div className="container darker">
                <img src={this.props.image} alt="Avatar" />
                <p style={{ textAlign: "right" }}>{data.chatmsg}</p>
                <span className="time-right">
                  {new Date(data.timestamp).toLocaleString()}
                </span>
              </div>
            )}
        </div>
      );
    });
    this.setState({ chat_comp: chatComp });
  }

  componentDidMount() {
    this._isMounted = true;
    socketAPI.socket.on("websocket", (result) => {
      result = JSON.parse(result);
      result["chatmsg"] = this.props.get_decrypted_key(result["chatmsg"]);
      this.setState({
        received_msgs: [result],
      });
      this.loadChat();
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <Modal
        onShow={this.loadChat}
        show={this.props.show}
        onHide={this.props.onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {this.props.username}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={ChatContainerStyle}>{this.state.chat_comp}</div>
          <div>
            <Form>
              <Form.Row className="align-items-center">
                <Col sm={7} className="my-1">
                  <Form.Control
                    id="chat-input-id"
                    placeholder="Type a message"
                    onChange={this.onChange}
                  />
                </Col>
                <Col xs="auto" className="my-1">
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <EmojiEmotionsIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <AttachmentIcon />
                  </IconButton>
                  <input
                    id="fileInput"
                    type="file"
                    style={{ display: "none" }}
                  />
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <PhotoCamera />
                  </IconButton>
                </Col>
                <Col xs="auto" className="my-1">
                  <ThemeProvider theme={ButtonTheme}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SendIcon />}
                      onClick={this.sendChat}
                    >
                      Send
                    </Button>
                  </ThemeProvider>
                </Col>
              </Form.Row>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default ChatModal;
