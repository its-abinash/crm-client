import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Cookies from "universal-cookie";
import lodash from "lodash";
import {
  RESTService,
  encUtil,
  NotificationUtil,
} from "../main_utils/main_utils";
const cookies = new Cookies();

const theme = createTheme();

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this._notificationUtil = null;
    this.state = {
      email: "",
      password: "",
      login_component: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.showNotification = this.showNotification.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var payload = {
      email: data.get("email"),
      password: data.get("password"),
    };

    var encryptedPayload = encUtil.encryptPayload(payload);
    var finalPayload = { payload: encryptedPayload };
    var callOptions = {
      method: "POST",
      url: "http://localhost:3001/login",
      timeout: 60 * 1000,
      data: finalPayload,
    };

    var result = await RESTService.makeRequest(callOptions);
    if (result.checkValidResponse()) {
      var values = result.getValuesFromResponse();
      var statusCode = result.getStatusCode();
      if (statusCode === 200 && values[0].auth) {
        // Caching user data
        cookies.set("userId", data.get("email"));
        cookies.set(
          "password",
          encUtil.getEncryptedValue(data.get("password"))
        );
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
  };

  showNotification() {
    this._notificationUtil && this._notificationUtil.notify();
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={this.handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="http://localhost:3000/sign-up" variant="body2">
                    {"Don't have an account? Signup now"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}

export default SignIn;
