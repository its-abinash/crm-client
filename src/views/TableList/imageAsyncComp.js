import { useState } from "react";
import Card from "react-bootstrap/Card";
import lodash from "lodash";
import axios from "axios";

const cardImgStyle = {
  width: "20%",
  height: "20%",
  borderRadius: "50%",
  display: "flex",
  float: "right",
};

async function getDefaultPicture(username) {
  var [firstname, lastname] = lodash.split(username, " ");
  const queryString = `background=B0E0E6&color=0000CD&name=${firstname}+${lastname}&size=120`;
  const avatar_options = {
    method: "GET",
    url: `https://ui-avatars.com/api/?${queryString}`,
    responseType: "arraybuffer",
    timeout: 10 * 1000,
  };
  var avatarResult = await axios(avatar_options);
  var profile_image = Buffer.from(avatarResult.data, "binary").toString(
    "base64"
  );
  profile_image = `data:image/png;base64,${profile_image}`;
  return profile_image;
}

var LoadImage = function (props) {
  var { classes, image, name } = props;
  var [profileImage, setProfileImg] = useState(null);
  if (!image) {
    getDefaultPicture(name).then((profileImage) => {
      setProfileImg(profileImage);
    });
  }
  if (profileImage != null) {
    image = profileImage;
  }
  return (
    <div className={{ position: "absolute" }}>
      <img
        className={classes.img}
        style={cardImgStyle}
        src={image}
        alt="sans"
      />
      <Card.Title> {name} </Card.Title>
    </div>
  );
};

export default LoadImage;
