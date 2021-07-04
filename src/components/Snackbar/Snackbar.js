import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Snack from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
// @material-ui/icons
import Close from "@material-ui/icons/Close";
// core components
import styles from "../../assets/jss/material-dashboard-react/components/snackbarContentStyle.js";

const useStyles = makeStyles(styles);

export default function Snackbar(props) {
  const classes = useStyles();
  const { message, color, close, icon, open } = props;
  var action = [];
  const time = 4000;
  const messageClasses = classNames({
    [classes.iconMessage]: icon !== undefined,
  });
  if (close !== undefined) {
    action = [
      <IconButton
        className={classes.iconButton}
        key="close"
        aria-label="Close"
        color="inherit"
        onClick={() => props.closeNotification()}
      >
        <Close className={classes.close} />
      </IconButton>,
    ];
  }
  return (
    <Snack
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      autoHideDuration={time}
      open={open}
      message={
        <div>
          {icon !== undefined ? <props.icon className={classes.icon} /> : null}
          <span className={messageClasses}>{message}</span>
        </div>
      }
      action={action}
      onClose={() => props.closeNotification()}
      ContentProps={{
        classes: {
          root: classes.root + " " + classes[color],
          message: classes.message,
        },
      }}
    />
  );
}

Snackbar.propTypes = {
  message: PropTypes.node.isRequired,
  color: PropTypes.oneOf(["info", "success", "warning", "danger", "primary"]),
  close: PropTypes.bool,
  icon: PropTypes.object,
  place: PropTypes.oneOf(["tl", "tr", "tc", "br", "bl", "bc"]),
  open: PropTypes.bool,
};
