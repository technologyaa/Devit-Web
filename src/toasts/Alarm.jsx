import toast from "react-hot-toast";
import { ToastContainer, ToastContent, ToastIcon, ToastMessage } from "./Toast";

let activeToasts = [];

export const Alarm = async (
  icon,
  message,
  textColor = "#883cbe",
  bgColor = "#f3e8ff"
) => {
  // 🧹 2개 초과 시 가장 오래된 토스트 제거
  if (activeToasts.length >= 2) {
    const oldestId = activeToasts.shift();
    toast.dismiss(oldestId);

    // react-hot-toast가 실제로 DOM에서 제거될 때까지 살짝 대기 (안 하면 3개 뜰 수 있음)
    await new Promise((res) => setTimeout(res, 50));
  }

  // 🆕 새 토스트 생성
  const id = toast.custom(
    (t) => (
      <ToastContainer
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

  // 배열에 새 토스트 ID 추가
  activeToasts.push(id);

  // 자동 제거 시 배열에서도 제거
  setTimeout(() => {
    activeToasts = activeToasts.filter((toastId) => toastId !== id);
  }, 3100);
};
