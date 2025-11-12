import toast from "react-hot-toast";
import { ToastContainer, ToastContent, ToastIcon, ToastMessage } from "./Toast";

let activeToasts = [];

export const Alarm = (
  icon,
  message,
  textColor = "#883cbe",
  bgColor = "#f3e8ff"
) => {
  // 1️⃣ 기존 toast가 있으면 fadeOut 후 제거
  if (activeToasts.length > 0) {
    const oldestId = activeToasts.shift();
    // 기존 toast에 fadeOut 클래스 적용 후 400ms 후 dismiss
    const element = document.getElementById(`toast-${oldestId}`);
    if (element) {
      element.classList.add("fade-out"); // CSS에서 정의
      setTimeout(() => {
        toast.dismiss(oldestId);
      }, 400); // fadeOut 애니메이션 길이와 동일
    } else {
      toast.dismiss(oldestId);
    }
  }

  // 2️⃣ 새 toast 생성
  const id = toast.custom(
    (t) => (
      <ToastContainer
        id={`toast-${t.id}`} // DOM 요소에 id 추가
        color={textColor}
        bgColor={bgColor}
        onClick={(e) => {
          e.stopPropagation();
          toast.dismiss(t.id);
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

  activeToasts.push(id);

  // 자동 제거 시 배열에서도 제거
  setTimeout(() => {
    activeToasts = activeToasts.filter((toastId) => toastId !== id);
  }, 3100);
};
