import { lazy, Suspense } from "react";
import Card from "react-bootstrap/Card";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import EmailIcon from "@material-ui/icons/Email";
import ChatIcon from "@material-ui/icons/Chat";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { blue, green } from "@material-ui/core/colors";

const LoadImage = lazy(() => import("./imageAsyncComp"));

const cardStyle = {
  width: "25rem",
  marginRight: "25px",
  marginTop: "10px",
  marginBottom: "10px",
  borderRadius: "10%",
  borderColor: "orange",
};

const buttonStyle = {
  marginRight: "5px",
  marginTop: "2px",
  marginBottom: "2px",
  borderRadius: "10%",
};

const ButtonTheme = createMuiTheme({
  palette: {
    primary: green,
    secondary: blue,
  },
});

const deleteBtnStyle = { backgroundColor: "red" };

var LoadProfileCard = function (props) {
  var { classes, data, setState } = props;
  return (
    <Card style={cardStyle}>
      <Card.Body>
        <Suspense fallback={<div>Loading...</div>}>
          <LoadImage classes={classes} image={data.image} name={data.name} />
        </Suspense>
        <Card.Subtitle className="mb-2 text-muted">
          General Manager
        </Card.Subtitle>
        <Card.Text>{data.email}</Card.Text>
        <ThemeProvider theme={ButtonTheme}>
          <Button
            variant="contained"
            className={classes.button}
            startIcon={<DeleteIcon />}
            style={{ ...buttonStyle, ...deleteBtnStyle }}
            onClick={() => {
              setState({ DeleteModalShow: true });
              setState({ user_of_activated_modal: data.email });
              setState({ username_of_activated_modal: data.name });
            }}
          >
            Delete
          </Button>
        </ThemeProvider>
        <ThemeProvider theme={ButtonTheme}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<EmailIcon />}
            style={buttonStyle}
            onClick={() => {
              setState({ EmailModalShow: true });
              setState({ user_of_activated_modal: data.email });
              setState({ username_of_activated_modal: data.name });
            }}
          >
            Email
          </Button>
        </ThemeProvider>
        <ThemeProvider theme={ButtonTheme}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<ChatIcon />}
            style={buttonStyle}
            onClick={() => {
              setState({ ChatModalShow: true });
              setState({ user_of_activated_modal: data.email });
              setState({ username_of_activated_modal: data.name });
              setState({ image_of_activated_modal: data.image });
            }}
          >
            Chat
          </Button>
        </ThemeProvider>
      </Card.Body>
    </Card>
  );
};

export default LoadProfileCard;
