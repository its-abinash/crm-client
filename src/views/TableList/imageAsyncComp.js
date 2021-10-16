import { useState, lazy, Suspense } from "react";
import Card from "react-bootstrap/Card";
import lodash from "lodash";

const LoadAvatar = lazy(() => import("../../components/Avatar"));

async function get_user_image(userId, headers, callback) {
  const URL = `http://localhost:3001/user/${userId}`;
  const options = {
    method: "GET",
    url: URL,
    timeout: 60 * 1000,
    headers: headers,
  };
  var result = await callback(options);
  var values = result.data.values[0];
  var profile_image = lodash.has(values, "media.image")
    ? values.media.image
    : null;
  return profile_image;
}

var LoadImage = function (props) {
  var { image, name, userId, headers, callback, isChatAvatar, loggedInUser } =
    props;

  var [profileImg, setProfileImg] = useState(null);
  if (!image && headers) {
    get_user_image(userId, headers, callback).then((profileImg) =>
      setProfileImg(profileImg)
    );
  }

  if (profileImg && !image) {
    image = profileImg;
  }

  if (isChatAvatar === true) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <LoadAvatar
          name={userId.toUpperCase()}
          data={image}
          imgPos={loggedInUser ? "right" : "left"}
        />
      </Suspense>
    );
  }

  return (
    <div className={{ position: "absolute" }}>
      <Suspense fallback={<div>Loading...</div>}>
        <LoadAvatar
          name={userId.toUpperCase()}
          data={image}
          isProfileCardAvatar={true}
        />
        <Card.Title> {name} </Card.Title>
      </Suspense>
    </div>
  );
};

export default LoadImage;
