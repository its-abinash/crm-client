import { Component } from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";

class NotificationUtil extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <ClickAwayListener onClickAway={this.props.handleCloseNotification}>
        <MenuList role="menu">
          {this.props.notifications &&
            this.props.notifications.map((notification, index) => {
              return (
                <MenuItem
                  key={index}
                  onClick={this.props.handleCloseNotification}
                  className={this.props.classes.dropdownItem}
                >
                  {notification}
                </MenuItem>
              );
            })}
        </MenuList>
      </ClickAwayListener>
    );
  }
}

export default NotificationUtil;
