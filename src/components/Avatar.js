import React from "react";
import Avatar from "@material-ui/core/Avatar";
import lodash from "lodash";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */
  return color;
}

function stringAvatar(name) {
  return {
    children: `${lodash.isEmpty(name) ? "" : name[0]}`,
  };
}

export default function GetAvatar(props) {
  var {
    name,
    data,
    mouse_on_image,
    isOwnProfile,
    isProfileCardAvatar,
    imgPos,
  } = props;
  var avatarStyle = {
    opacity: mouse_on_image ? "0" : "1",
    float: imgPos ? imgPos : "none",
    width: isOwnProfile ? 100 : 56,
    height: isOwnProfile ? 100 : 56,
    fontSize: isOwnProfile ? 40 : 25,
    backgroundColor: stringToColor(name),
  };

  var profileCardAvatarStyle = {
    float: "right",
    width: 56,
    height: 56,
    backgroundColor: stringToColor(name),
  };

  if (isOwnProfile && data) {
    return <img style={avatarStyle} alt="myProfilePic" src={data} />;
  }

  return (
    <Avatar
      style={isProfileCardAvatar ? profileCardAvatarStyle : avatarStyle}
      src={data}
      {...stringAvatar(name)}
    />
  );
}
