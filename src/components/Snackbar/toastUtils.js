import { toast } from "react-toastify";
import lodash from "lodash";

// Custom toastId has been used to avoid allowing duplicate toast msg
const TOAST_ID = "918ebe0e-64d6-4f81-ba24-e894a4a16040";

export var pushNotification = function (NotificationObject) {
  const notificationType = NotificationObject["type"];
  const notificationMessage = NotificationObject["message"];
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
