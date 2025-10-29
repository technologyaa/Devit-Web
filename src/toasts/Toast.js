import styled, { keyframes } from "styled-components";

const slideUp = keyframes`
  from { transform: translateY(12px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { transform: translateY(-12px); opacity: 0; }
`;

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
  box-shadow: 0 8px 24px rgba(91, 33, 182, 0.2);
  position: relative;
  overflow: hidden;
  animation: ${slideUp} 0.4s ease, ${fadeOut} 0.4s ease 2.6s forwards;
  height: 42px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px;
    background: #ffffffaa;
    width: 100%;
    animation: ${shrink} 2.6s linear forwards;
    border-radius: 0 0 16px 16px;
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
