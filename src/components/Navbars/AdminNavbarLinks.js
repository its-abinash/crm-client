import React from "react";
import classNames from "classnames";
import Cookies from "universal-cookie";
import clientSocket from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import Dashboard from "@material-ui/icons/Dashboard";
import Button from "@material-ui/core/Button";
import lodash from "lodash";
import styles from "../../assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import { useHistory } from "react-router-dom";
import NotificationUtil from "../../views/Notifications/NotificationUtils.js";
import { withStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(styles);

const cookies = new Cookies();
const SOCKET_URL = "http://localhost:3001";

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))(Badge);

export default function AdminNavbarLinks() {
  const classes = useStyles();
  const [openNotification, setOpenNotification] = React.useState(null);
  const [openProfile, setOpenProfile] = React.useState(null);
  const history = useHistory();
  const [notifications, setNotification] = React.useState([]);
  React.useEffect(() => {
    const socket = clientSocket(SOCKET_URL);
    socket.on("CrmSync", (result) => {
      setNotification([...notifications, ...result.reasons]);
    });
    return function cleanup() {
      socket.disconnect();
    };
  });

  const handleClickNotification = (event) => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };
  const handleCloseNotification = () => {
    setOpenNotification(null);
  };
  const handleClickProfile = (event) => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    var cookiesList = cookies.getAll();
    for (const key of lodash.keys(cookiesList)) {
      cookies.remove(key);
    }
    history.push("/sign-in");
  };
  return (
    <div>
      <div className={classes.searchWrapper}></div>
      <Button
        color={window.innerWidth > 959 ? "inherit" : "white"}
        aria-label="Dashboard"
        className={classes.buttonLink}
        onClick={() => {
          history.push("/admin/dashboard");
        }}
      >
        <Dashboard className={classes.icons} />
        <Hidden mdUp implementation="css">
          <p className={classes.linkText}>Dashboard</p>
        </Hidden>
      </Button>
      <div className={classes.manager}>
        <IconButton aria-label="cart" onClick={handleClickNotification}>
          <StyledBadge badgeContent={notifications.length} color="primary">
            <Notifications />
          </StyledBadge>
        </IconButton>
        <Poppers
          open={Boolean(openNotification)}
          anchorEl={openNotification}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openNotification }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="notification-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <NotificationUtil
                  classes={classes}
                  handleCloseNotification={handleCloseNotification}
                  notifications={notifications}
                />
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? "inherit" : "white"}
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openProfile }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener
                  onClickAway={() => {
                    setOpenProfile(null);
                  }}
                >
                  <MenuList role="menu">
                    <MenuItem
                      onClick={() => {}}
                      className={classes.dropdownItem}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => {}}
                      className={classes.dropdownItem}
                    >
                      Settings
                    </MenuItem>
                    <Divider light />
                    <MenuItem
                      onClick={handleCloseProfile}
                      className={classes.dropdownItem}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
    </div>
  );
}
