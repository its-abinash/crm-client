import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Toast(props) {
  const { notificationType, notificationMessage } = props;

  if (notificationType === "success") {
    toast.success(notificationMessage);
  } else if (notificationType === "error") {
    toast.error(notificationMessage);
  } else if (notificationType === "warning") {
    toast.warn(notificationMessage);
  } else if (notificationType === "info") {
    toast.info(notificationMessage);
  } else {
    toast(notificationMessage);
  }

  return <ToastContainer />;
}

export default Toast