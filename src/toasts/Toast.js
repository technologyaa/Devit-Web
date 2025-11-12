import styled, { keyframes } from "styled-components";

// 슬라이드업
const slideUp = keyframes`
  from { transform: translateY(12px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// 기본 fadeOut (애니메이션)
const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; transform: translateY(-12px); }
`;

// progress bar
const shrink = keyframes`
  from { width: 100%; }
  to { width: 0; }
`;

export const ToastContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${(props) => props.bgColor || "#f3e8ff"};
  color: ${(props) => props.color || "#883cbe"};
  border-radius: 16px;
  padding: 14px 20px;
  font-weight: 600;
  font-size: 15px;
  width: 260px;
  box-shadow: 0 8px 12px rgba(91, 33, 182, 0.2);
  position: relative;
  overflow: hidden;
  height: 42px;
  animation: ${slideUp} 0.4s ease forwards;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px;
    background: #ffffffaa;
    width: 100%;
    animation: ${shrink} 3s linear forwards;
    border-radius: 0 0 16px 16px;
  }

  // fadeOut 클래스 적용 시
  &.fade-out {
    animation: ${fadeOut} 0s ease forwards;
  }
`;

export const ToastContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

export const ToastIcon = styled.span`
  font-size: 20px;
`;

export const ToastMessage = styled.span`
  flex: 1;
`;
