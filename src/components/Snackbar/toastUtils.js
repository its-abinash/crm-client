import { toast } from "react-toastify";
import lodash from "lodash";
import { customNotification } from "../../constants/constants";
import { util } from "../../main_utils/main_utils";

// Custom toastId has been used to avoid allowing duplicate toast msg
const TOAST_ID = "918ebe0e-64d6-4f81-ba24-e894a4a16040";

export var pushNotification = function (NotificationObject) {
  const notificationType = NotificationObject["type"];
  const translateCodes = NotificationObject["translateCodes"];
  const notificationMessage = util.format(
    customNotification[NotificationObject["message"]],
    translateCodes
  );
  if (lodash.isEmpty(notificationMessage)) return;
  const toastConfig = { toastId: TOAST_ID };
  switch (notificationType) {
    case "success":
      toast.success(notificationMessage, toastConfig);
      break;
    case "info":
      toast.info(notificationMessage, toastConfig);
      break;
    case "error":
      toast.error(notificationMessage, toastConfig);
      break;
    case "warning":
      toast.warn(notificationMessage, toastConfig);
      break;
    default:
      toast(notificationMessage, toastConfig);
      break;
  }
};
