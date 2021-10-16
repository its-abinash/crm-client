import { lazy, Suspense } from "react";
const LoadImage = lazy(() => import("../views/TableList/imageAsyncComp"));

var LoadChatImage = function (props) {
  var { data, userid, loggedInUser, headers, callback } = props;
  var { image, chatmsg, timestamp, locale } = data;

  return (
    <div className={loggedInUser ? "container darker" : "container"}>
      <div style={{ justifyContent: "space-between" }}>
        <Suspense fallback={<div>Loading...</div>}>
          <LoadImage
            userId={userid}
            loggedInUser={loggedInUser}
            image={image}
            headers={headers}
            callback={callback}
            isChatAvatar={true}
          />
        </Suspense>
        <p style={{ textAlign: loggedInUser ? "right" : "left" }}>{chatmsg}</p>
      </div>
      <span className={loggedInUser ? "time-right" : "time-left"}>
        {new Date(timestamp).toLocaleString(locale, {hour12: true})}
      </span>
    </div>
  );
};

export default LoadChatImage;
