import styled, { keyframes } from "styled-components";

// 부드러운 슬라이드 + 알파 페이드
const slideUp = keyframes`
  from { transform: translateY(14px) scale(0.98); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
`;

// 사라질 때 자연스러운 shrink fade
const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-6px) scale(0.96); }
`;

// progress bar
const shrink = keyframes`
  from { width: 100%; }
  to { width: 0%; }
`;

export const ToastContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  background: ${(props) =>
    `linear-gradient(135deg, ${props.$bgColor}aa, ${props.$bgColor}ee)`};
  color: ${(props) => props.$color || "#222"};

  backdrop-filter: blur(10px) saturate(160%);
  -webkit-backdrop-filter: blur(10px) saturate(160%);

  border-radius: 18px;
  padding: 14px 20px;

  min-width: 260px;
  max-width: 330px;

  font-size: 15px;
  font-weight: 600;

  box-shadow: 0px 12px 28px rgba(0, 0, 0, 0.14),
    0px 4px 12px rgba(0, 0, 0, 0.06);

  border: 1px solid rgba(255, 255, 255, 0.35);

  animation: ${slideUp} 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards;

  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;

    height: 3px;
    width: 100%;
    border-radius: 0 0 18px 18px;

    background: ${(props) => props.$color}55;
    animation: ${shrink} 3s linear forwards;
  }

  &.fade-out {
    animation: ${fadeOut} 0.26s ease forwards;
  }
`;

export const ToastContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

export const ToastIcon = styled.div`
  width: 26px;
  height: 26px;

  border-radius: 50%;
  background: ${(props) => props.$color}22;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${(props) => props.$color};

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2.2;
  }
`;

export const ToastMessage = styled.div`
  flex: 1;
  font-size: 14.5px;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.2px;
`;
