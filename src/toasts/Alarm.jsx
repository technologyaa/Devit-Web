import toast from "react-hot-toast";
import "../toasts/Toast.css";

export const Alarm = (icon, message) => {
  toast(
    <div className="toast-content">
      <span className="toast-icon">{icon}</span>
      <span className="toast-message">{message}</span>
    </div>,
    {
      className: "custom-toast",
      duration: 3000,
    }
  );
};
