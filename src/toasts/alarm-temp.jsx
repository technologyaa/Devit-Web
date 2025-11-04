import toast from "react-hot-toast";
import { ToastContainer, ToastContent, ToastIcon, ToastMessage } from "./Toast";

export const Alarm = (
  icon,
  message,
  textColor = "#883cbe",
  bgColor = "#f3e8ff"
) => {
  toast.custom(
    (t) => (
      <ToastContainer
        color={textColor}
        bgColor={bgColor}
        onClick={(e) => {
          e.stopPropagation(); // 클릭 이벤트가 부모로 전달되는 걸 막음
          toast.dismiss(t.id); // 클릭 시 즉시 닫기
        }}
      >
        <ToastContent>
          <ToastIcon>{icon}</ToastIcon>
          <ToastMessage>{message}</ToastMessage>
        </ToastContent>
      </ToastContainer>
    ),
    {
      duration: 3000,
      position: "top-right",
    }
  );
};
