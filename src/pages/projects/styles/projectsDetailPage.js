import styled from "styled-components";
import { Image } from "@/styles/Image";

export const Container = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
`;

export const Frame = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Top = styled.div`
  font-size: 26px;
  font-weight: 500;
  color: black;
  position: relative;
`;

export const Bottom = styled.div`
  width: 100%;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  flex-direction: column;
`;

export const BackIcon = styled(Image)`
  width: 14px;
  cursor: pointer;
`;

export const ProjectText = styled.span`
  font-size: 26px;
  font-weight: 500;
  color: #111;
`;

export const TopWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Banner = styled.div`
  width: 100%;
  height: 220px;
  background-color: #e0e0e0;
  border-radius: 12px;
`;

export const BottomLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const BottomTop = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const TaskBoxAddButton = styled(Image)`
  width: 16px;
`;

export const TaskBoxWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TaskBoxTitle = styled.div`
  width: 100%;
  font-size: 20px;
  font-weight: 500;
`;

export const TaskBox = styled.div`
  width: 100%;
  height: 72px;
  border: 1px solid #d3d3d3;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 18px;
  box-sizing: border-box;
  cursor: pointer;
`;

export const TaskBoxLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const TaskBoxRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TaskImage = styled(Image)`
  width: 42px;
`;

export const TaskTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

export const TaskStatus = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => (props.isDone ? "#4CAF50" : "red")};
`;

export const CreditBox = styled.div`
  width: 28%;
  height: 240px;
  border: 1px solid #d3d3d3;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
`;

export const BottomWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 24px;
  justify-content: space-between;
`;

export const CreditText = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin: 16px 0 8px 16px;
`;

export const CreditAmount = styled.div`
  font-size: 32px;
  font-weight: 600;
  margin-left: 16px;
`;

export const DescribeText = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #666666;
  margin: 8px 0 0 16px;
`;

export const Line = styled.div`
  width: 84%;
  height: 1px;
  background-color: #d3d3d3;
  margin: 12px auto 0 auto;
`;

export const ShopButton = styled.button`
  width: 60%;
  height: 38px;
  background-color: #883cbe;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
`;

export const CreditBoxTop = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
`;

export const CreditBoxBottom = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

// ✅ 모달 전체를 덮는 배경 (반투명 오버레이)
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

// ✅ 모달 안쪽 컨테이너
export const ModalContent = styled.div`
  background-color: #fff;
  width: 520px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  padding: 40px 36px 20px;
`;

// ✅ 모달 내부 구조
export const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ModalTitle = styled.h2`
  width: 100%;
  display: flex;
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 20px;
`;

// ✅ 입력박스 공통
export const ProjectInputBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ProjectInputText = styled.p`
  width: 100%;
  display: flex;
  font-size: 16px;
  font-weight: 500;
`;

export const ProjectInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  line-height: normal;
  appearance: none;
  background-color: #fff;
  font-family: inherit;
  outline: none;
  &:focus {
    outline: 1px solid #883cbe;
  }
`;

// ✅ 설명 입력
export const ProjectDesInputBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ProjectDesInputText = styled.p`
  width: 100%;
  display: flex;
  font-size: 16px;
  font-weight: 500;
`;

export const ProjectDesInput = styled.textarea`
  width: 100%;
  height: 84px;
  padding: 12px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  line-height: normal;
  appearance: none;
  background-color: #fff;
  font-family: inherit;
  resize: none;
  &:focus {
    outline: 1px solid #883cbe;
  }
`;

export const CancelButton = styled.button`
  font-size: 16px;
  background: #eee;
  border: none;
  border-radius: 6px;
  width: 120px;
  height: 40px;
  cursor: pointer;
  &:hover {
    background: #ddd;
  }
`;

export const CreateButton = styled.button`
  color: white;
  font-size: 16px;
  background: #883cbe;
  opacity: 0.9;
  border: none;
  border-radius: 6px;
  width: 120px;
  height: 40px;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;

export const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 12px;
`;

export const ProjectSettingsIcon = styled(Image)`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

export const TopLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const MoreBox = styled.div`
  position: absolute;
  top: 30px;
  right: 4px;
  width: 160px;
  background-color: #fff;
  border: 1px solid #d3d3d3;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
`;

export const MoreItem = styled.div`
  padding: 14px 18px;
  font-size: 16px;
  color: black;
  cursor: pointer;
  transition: background 0.2s ease;
  &:hover {
    background-color: #f8f9fa;
  }
`;

export const WarningText = styled.p`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  font-size: 16px;
  color: #333;
  line-height: 1.6;
  margin: 0;
  text-align: center;
`;

export const DeleteButton = styled.button`
  color: white;
  font-size: 16px;
  background: red;
  opacity: 0.9;
  border: none;
  border-radius: 6px;
  width: 120px;
  height: 40px;
  cursor: pointer;
  &:hover {
    opacity: 1;
    background: red;
  }
`;

export const DeleteModalContent = styled.div`
  background-color: #fff;
  width: 380px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  padding: 40px 36px 20px;
`;

export const DeleteModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;
