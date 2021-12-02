import React, { Component } from "react";
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Card from "../../components/Card/Card.js";
import Button from "@material-ui/core/Button";
import CardHeader from "../../components/Card/CardHeader.js";
import CardAvatar from "../../components/Card/CardAvatar.js";
import IconButton from "@material-ui/core/IconButton";
import PublishIcon from "@material-ui/icons/Publish";
import DeleteIcon from "@material-ui/icons/Delete";
import CardBody from "../../components/Card/CardBody.js";
import CardFooter from "../../components/Card/CardFooter.js";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import Slider from "@material-ui/core/Slider";
import UpdateRoundedIcon from "@material-ui/icons/UpdateRounded";
import { Col, Form, Row } from "react-bootstrap";
import Cookies from "universal-cookie";
import SelectDropdown from "../../hooks/select.js";
import lodash from "lodash";
import { REMAINDER_FREQUENCY_SLIDER_MARKS } from "../../constants/constants.js";
import Avatar from "../../components/Avatar";
import {
  RESTService,
  encUtil,
  NotificationUtil,
} from "../../main_utils/main_utils";

var cardCategoryWhite = {
  color: "rgba(255,255,255,.62)",
  margin: "0",
  fontSize: "14px",
  marginTop: "0",
  marginBottom: "0",
};
var cardTitleWhite = {
  color: "#FFFFFF",
  marginTop: "0px",
  minHeight: "auto",
  fontWeight: "300",
  fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  marginBottom: "3px",
  textDecoration: "none",
};

var PhoneNumFlexBox = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  justifyContent: "space-between",
  alignContent: "space-between",
};

const cookies = new Cookies();

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      profile_image: "",
      new_profile_picture_data: {},
      name: "",
      user_phone_number: "",
      remainder_frequency: null,
      prev_password_from_db: "",
      prev_password_from_inp: "",
      new_password_from_inp: "",
      passcode: "",
      prev_password_from_inp_is_correct: false,
      new_password_matched_with_prev: false,
      has_one_lowercase_letter: false,
      has_one_upper_case_letter: false,
      has_one_numeric_value: false,
      has_one_special_char: false,
      has_length_more_than_decided: false,
      phone_number: "",
      countryCode: "",
      response_status: "danger",
      response_message: "",
      mouse_on_image: false,
    };
    this._notificationUtil = null;
    this.inputRef = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.onChangeDropdownValue = this.onChangeDropdownValue.bind(this);
    this.processAndSaveCookiesInState =
      this.processAndSaveCookiesInState.bind(this);
    this.verifyPasswordAndReport = this.verifyPasswordAndReport.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.GetHeaders = this.GetHeaders.bind(this);
    this.checkAndGetRequestType = this.checkAndGetRequestType.bind(this);
    this.buildPatchUrlFromPayload = this.buildPatchUrlFromPayload.bind(this);
    this.get_user_data = this.get_user_data.bind(this);
    this.readImage = this.readImage.bind(this);
    this.deleteProfilePicture = this.deleteProfilePicture.bind(this);
    this.showNotification = this.showNotification.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.name === "prev_password_from_inp") {
      this.setState({
        prev_password_from_inp_is_correct:
          event.target.value === this.state.prev_password_from_db,
      });
    }
    if (event.target.name === "new_password_from_inp") {
      this.setState({
        new_password_matched_with_prev:
          event.target.value === this.state.prev_password_from_db,
      });
    }
    if (event.target.name === "new_password_from_inp") {
      var input = event.target.value;
      this.setState({
        has_one_lowercase_letter: input.match("^(?=.*[a-z]).+$") || false,
      });
      this.setState({
        has_one_upper_case_letter: input.match("^(?=.*[A-Z]).+$") || false,
      });
      this.setState({
        has_one_numeric_value: input.match("^(?=.*\\d).+$") || false,
      });
      this.setState({
        has_one_special_char:
          input.match("^(?=.*[-+_!@#$%^&*.,?]).+$") || false,
      });
      this.setState({
        has_length_more_than_decided: input.length >= 8,
      });
    }
  }

  onChangeDropdownValue(selectedOption) {
    this.setState({ countryCode: selectedOption.value });
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

  verifyInputPropertiesAndReport() {
    return (
      (this.state.new_password_from_inp.length > 0 &&
        this.verifyPasswordAndReport() === true) ||
      (this.state.prev_password_from_inp_is_correct === true &&
        this.state.prev_password_from_inp.length > 0) ||
      this.state.username.length > 0 ||
      this.state.remainder_frequency ||
      this.inputRef.current.files[0]
    );
  }

  checkAndGetRequestType(payload) {
    if (
      payload &&
      payload.profile &&
      payload.profile.name &&
      payload.profile.phone &&
      payload.profile.remainder_freq &&
      payload.profile.password &&
      payload.profile.passcode &&
      payload.media &&
      payload.media.profile_picture
    ) {
      return "PUT";
    }
    return "PATCH";
  }

  buildPatchUrlFromPayload(payload) {
    var url = "http://localhost:3001/edit?";
    var qpArgString = `email=${this.state.email}&`;
    if (payload && payload.profile) {
      if (payload.profile.name) {
        qpArgString += `name=${payload.profile.name}&`;
      }
      if (payload.profile.phone) {
        qpArgString += `phone=${payload.profile.phone}&`;
      }
      if (payload.profile.remainder_freq) {
        qpArgString += `remainder_freq=${payload.profile.remainder_freq}&`;
      }
      if (payload.profile.password) {
        qpArgString += `password=${payload.profile.password}&`;
      }
      if (payload.profile.passcode) {
        qpArgString += `passcode=${payload.profile.passcode}&`;
      }
    }
    if (payload && payload.media) {
      if (!lodash.isEmpty(this.state.new_profile_picture_data)) {
        lodash.forOwn(
          this.state.new_profile_picture_data,
          function (value, property) {
            qpArgString += `${property}=${value}&`;
          }
        );
      }
    }
    qpArgString = lodash.trimEnd(qpArgString);
    qpArgString = lodash.trimEnd(qpArgString, "&");
    url = url + encUtil.getEncryptedValue(qpArgString, "#");
    return url;
  }

  readImage(file, isText = false) {
    return new Promise((resolve, reject) => {
      var imgReader = new FileReader();
      imgReader.onload = () => {
        resolve(imgReader.result);
      };
      imgReader.onerror = reject;
      isText ? imgReader.readAsText(file) : imgReader.readAsDataURL(file);
    });
  }

  async onSubmit(event) {
    // Base Case
    event.preventDefault();
    var allPropertiesValidated = this.verifyInputPropertiesAndReport();
    if (!allPropertiesValidated) {
      this.showNotification("error", "INVALID_DATA", []);
      return;
    }
    var profile = {};
    var media = {};
    const {
      username,
      phone_number,
      remainder_frequency,
      new_password_from_inp,
      passcode,
      email,
    } = this.state;
    if (username.length > 0) {
      profile["name"] = username;
    }
    if (phone_number.length > 0) {
      profile["phone"] = phone_number;
    }
    if (remainder_frequency) {
      profile["remainder_freq"] = remainder_frequency;
    }
    if (new_password_from_inp.length > 0) {
      profile["password"] = new_password_from_inp;
    }
    if (passcode.length > 0) {
      profile["passcode"] = passcode;
    }
    if (this.inputRef.current.files[0]) {
      try {
        var file = this.inputRef.current.files[0];
        var data = {
          imagename: file.name,
          lastModified: file.lastModified,
          size: file.size,
          type: file.type,
        };
        var imageUri = await this.readImage(this.inputRef.current.files[0]);
        this.setState({ new_profile_picture_data: data });
        media["profile_picture"] = imageUri;
      } catch (exc) {
        this.showNotification("error", "INVALID_IMG", []);
      }
    }
    var finalPayload = {},
      payload = {};
    if (lodash.isEmpty(profile) && lodash.isEmpty(media)) {
      this.showNotification("warning", "EMPTY_DATA", []);
      return;
    } else if (lodash.isEmpty(profile)) {
      payload["email"] = email;
      payload["media"] = media;
    } else if (lodash.isEmpty(media)) {
      payload["email"] = email;
      payload["profile"] = profile;
    }

    finalPayload = { payload: encUtil.encryptPayload(payload) };
    var requestType = this.checkAndGetRequestType(payload);
    const options = {
      method: requestType,
      url:
        requestType === "PUT"
          ? "http://localhost:3001/edit"
          : this.buildPatchUrlFromPayload(payload),
      timeout: 60 * 1000,
      headers: this.GetHeaders(),
      data: finalPayload,
    };
    var result = await RESTService.makeRequest(options);
    this._notificationUtil = new NotificationUtil(
      result.getNotificationType(),
      result.getResponseId(),
      result.getTranslateCodes()
    );
    this.showNotification();
    await this.get_user_data();
  }

  async deleteProfilePicture() {
    var encryptedQpString = encUtil.getEncryptedValue("image=null", "#");
    const URL = `http://localhost:3001/user/${cookies.get(
      "userId"
    )}/?${encryptedQpString}`;
    const options = {
      method: "DELETE",
      url: URL,
      timeout: 60 * 1000,
      headers: this.GetHeaders(),
    };
    var result = await RESTService.makeRequest(options);
    this._notificationUtil = new NotificationUtil(
      result.getNotificationType(),
      result.getResponseId(),
      result.getTranslateCodes()
    );
    this.showNotification();
  }

  verifyPasswordAndReport() {
    const regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$";
    var result = this.state.new_password_from_inp.match(regex);
    return result && result.input.length >= 8 ? true : false;
  }

  processAndSaveCookiesInState() {
    var allCookies = cookies.getAll();
    var EncryptedPassword = allCookies["password"];
    var DecryptedPassword = encUtil.DecryptKey(EncryptedPassword);
    this.setState({
      email: allCookies["userId"],
      prev_password_from_db: DecryptedPassword,
    });
  }

  async get_user_data() {
    const URL = `http://localhost:3001/user/${cookies.get("userId")}`;
    const options = {
      method: "GET",
      url: URL,
      timeout: 60 * 1000,
      headers: this.GetHeaders(),
    };
    var result = await RESTService.makeRequest(options);
    var values = result.getValuesFromResponse()[0];
    var profile_image = lodash.has(values, "media.image")
      ? values.media.image
      : null;
    var username = lodash.has(values, "name") ? values.name : null;
    var phone = lodash.has(values, "phone") ? values.phone : null;
    this.setState({
      profile_image: profile_image,
      name: username,
      user_phone_number: phone,
    });
  }

  componentDidMount() {
    this.processAndSaveCookiesInState();
    this.get_user_data();
  }

  showNotification(notificationType, message, translateCodes) {
    this._notificationUtil && this._notificationUtil.notify();
  }

  render() {
    return (
      <div>
        <GridContainer>
          <GridItem xs={10} sm={10} md={8}>
            <Card>
              <CardHeader color="primary">
                <h4 className={cardTitleWhite}>Edit Profile</h4>
                <p className={cardCategoryWhite}>Complete your profile</p>
              </CardHeader>
              <CardBody>
                <Form id="updateForm">
                  <Form.Group className="updateEmail" controlId="updateEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={this.state.email}
                      readOnly
                    />
                    <Form.Text className="text-muted">
                      You can't change the email
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="updateName" controlId="updateName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      onChange={this.onChange}
                      placeholder="Enter your name"
                      autoComplete="off"
                    />
                  </Form.Group>
                  <Row>
                    <Col md>
                      <Form.Group
                        className="prevPassword"
                        controlId="prevPassword"
                      >
                        <Form.Label>Previous Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter Current Password"
                          autoComplete="off"
                          name="prev_password_from_inp"
                          onChange={this.onChange}
                        />
                        <Form.Text className="SuccessPopUp">
                          {this.state.prev_password_from_inp_is_correct ===
                            true &&
                            this.state.prev_password_from_inp.length > 0 && (
                              <p style={{ color: "green" }}>
                                <CheckRoundedIcon />
                                Matched
                              </p>
                            )}
                        </Form.Text>
                        <Form.Text className="ErrorPopUp">
                          {this.state.prev_password_from_inp_is_correct ===
                            false &&
                            this.state.prev_password_from_inp.length > 0 && (
                              <p style={{ color: "red" }}>
                                <ClearRoundedIcon />
                                Not Matched
                              </p>
                            )}
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md>
                      <Form.Group
                        className="currPassword"
                        controlId="currPassword"
                      >
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter New Password"
                          autoComplete="off"
                          name="new_password_from_inp"
                          onChange={this.onChange}
                        />
                        <Form.Text className="SuccessPopUp">
                          {this.state.new_password_from_inp.length > 0 &&
                            this.state.new_password_matched_with_prev ===
                              false &&
                            this.verifyPasswordAndReport() === true && (
                              <p style={{ color: "green" }}>
                                <CheckRoundedIcon />
                                Verified
                              </p>
                            )}
                        </Form.Text>
                        <Form.Text className="ErrorPopUp1">
                          {this.state.new_password_matched_with_prev === true &&
                            this.state.new_password_from_inp.length > 0 && (
                              <p style={{ color: "red" }}>
                                <ClearRoundedIcon />
                                New password is matching with previous password
                              </p>
                            )}
                        </Form.Text>
                        <Form.Text className="ErrorPopUp2">
                          {this.state.new_password_from_inp.length > 0 &&
                            this.verifyPasswordAndReport() === false && (
                              <div>
                                <p style={{ color: "red" }}>
                                  {!this.state.has_one_upper_case_letter && (
                                    <li>
                                      Password must have at-least 1 uppercase
                                      character
                                    </li>
                                  )}
                                  {!this.state.has_one_lowercase_letter && (
                                    <li>
                                      Password must have at-least 1 lowercase
                                      character
                                    </li>
                                  )}
                                  {!this.state.has_one_special_char && (
                                    <li>
                                      Password must have at-least 1 special
                                      character
                                    </li>
                                  )}
                                  {!this.state.has_one_numeric_value && (
                                    <li>
                                      Password must have at-least 1 numeric
                                      value
                                    </li>
                                  )}
                                  {!this.state.has_length_more_than_decided && (
                                    <li>
                                      Password must have length more than 7
                                      letter
                                    </li>
                                  )}
                                </p>
                              </div>
                            )}
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group
                    className="updateMobNumber"
                    controlId="updateMobNumber"
                  >
                    <Form.Label>Mobile Number</Form.Label>
                    <div style={PhoneNumFlexBox}>
                      <div style={{ width: "200px" }}>
                        <SelectDropdown
                          default={true}
                          placeholder="Country Code"
                          onChange={this.onChangeDropdownValue}
                        />
                      </div>
                      <Form.Control
                        type="text"
                        placeholder="Enter Mobile Number"
                        name="phone_number"
                        onChange={this.onChange}
                        autoComplete="off"
                      />
                    </div>
                  </Form.Group>
                  <Form.Group
                    className="updateGPasscode"
                    controlId="updateGPasscode"
                  >
                    <Form.Label>Google Passcode</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Google Passcode"
                    />
                    <Form.Text className="text-muted">
                      We use this to enable the email feature in your account
                    </Form.Text>
                  </Form.Group>
                  <Form.Group
                    className="updateRemainderFreq"
                    controlId="updateRemainderFreq"
                  >
                    <Form.Label>Remainder Frequency</Form.Label>
                    <Slider
                      defaultValue={1}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      step={1}
                      marks={REMAINDER_FREQUENCY_SLIDER_MARKS}
                      onChange={(event, value) => {
                        this.setState({ remainder_frequency: value });
                      }}
                      min={1}
                      max={7}
                    />
                  </Form.Group>
                </Form>
              </CardBody>
              <CardFooter>
                <Button
                  form="updateForm"
                  variant="outlined"
                  color="primary"
                  type="submit"
                  onClick={this.onSubmit}
                  endIcon={<UpdateRoundedIcon />}
                >
                  Update Profile
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card profile>
              <CardAvatar profile>
                <input
                  type="file"
                  id="profile_img_file"
                  ref={this.inputRef}
                  accept="image/png, image/jpeg"
                  style={{ display: "none" }}
                />
                <div
                  className="profile-image"
                  onMouseOver={() => this.setState({ mouse_on_image: true })}
                  onMouseLeave={() => this.setState({ mouse_on_image: false })}
                >
                  <Avatar
                    name={this.state.email.toUpperCase()}
                    data={this.state.profile_image}
                    mouse_on_image={this.state.mouse_on_image}
                    isOwnProfile={true}
                  />
                  {this.state.mouse_on_image && (
                    <div
                      style={{
                        position: "absolute",
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "row",
                        top: "-2%",
                        left: "40%",
                      }}
                    >
                      <IconButton
                        color="default"
                        size="medium"
                        onClick={() => {
                          this.inputRef.current.click();
                        }}
                      >
                        <PublishIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        size="medium"
                        onClick={() => this.deleteProfilePicture()}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  )}
                </div>
              </CardAvatar>
              <CardBody profile>
                <h5 className="name">{this.state.name}</h5>
                <h6 className="phone">{this.state.user_phone_number}</h6>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default UserProfile;
