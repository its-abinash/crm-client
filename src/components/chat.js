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
import CachedIcon from "@material-ui/icons/Cached";
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

class ChatModal extends Component {
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
    const finalURL = `http://localhost:3001/chat/receivers/${receiver}/senders/${sender}`;
    var callOptions = {
      method: "GET",
      url: finalURL,
      headers: this.props.get_headers(),
      timeout: 60 * 1000,
    };
    return callOptions;
  }

  loadChat() {
    var callOptions = this.getPrevChatDataCallOptions();
    axios(callOptions).then((result) => {
      var prev_received_msgs = this.state.received_msgs;
      var curr_received_msgs = result.data.values;
      var unionOfCommonReceivedMessages = lodash.unionWith(
        prev_received_msgs,
        curr_received_msgs,
        lodash.isEqual
      );
      unionOfCommonReceivedMessages.sort(function (msg1, msg2) {
        return msg1["timestamp"] - msg2["timestamp"];
      });
      var chatComp = unionOfCommonReceivedMessages.map((data) => {
        return (
          <div key={data.timestamp}>
            {data.sender === this.props.user && (
              <div className="container">
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="Avatar"
                  className="right"
                />
                <p style={{ textAlign: "left" }}>{data.chatmsg}</p>
                <span className="time-left">
                  {new Date(data.timestamp).toLocaleString()}
                </span>
              </div>
            )}
            {data.sender === this.props.logged_in_user &&
              data.receiver === this.props.user && (
                <div className="container darker">
                  <img
                    src="https://www.w3schools.com/howto/img_avatar.png"
                    alt="Avatar"
                  />
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
    });
  }

  componentDidMount() {
    socketAPI.socket.on("websocket", (result) => {
      result = JSON.parse(result);
      result["chatmsg"] = this.props.get_decrypted_key(result["chatmsg"]);
      this.setState({
        received_msgs: [result],
      });
    });
  }

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        scrollable={true}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {this.props.username}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.state.chat_comp}</Modal.Body>
        <Modal.Footer>
          <Modal.Body>
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
                    aria-label="load prev chat"
                    component="span"
                    onClick={this.loadChat}
                  >
                    <CachedIcon />
                  </IconButton>
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
          </Modal.Body>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ChatModal;
