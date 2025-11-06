import styled, { keyframes } from "styled-components";
import { Image } from "@/styles/Image";

// 파일 업로드 임팩트 애니메이션
const fadeInScale = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

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
  color: #111;
  display: flex;
  align-items: flex-end;
  gap: 24px;
`;

export const Bottom = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const BackIcon = styled(Image)`
  width: 14px;
  cursor: pointer;
`;

export const ProjectText = styled.span`
  font-size: 26px;
  font-weight: 500;
`;

export const TopWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

export const TaskStatus = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => (props.isDone ? "#4CAF50" : "red")};
`;

export const DescriptionText = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #333;
`;

export const SubmitBox = styled.div`
  width: 340px;
  min-height: 180px;
  border: 1px solid #d3d3d3;
  border-radius: 12px;
  display: flex;
  gap: 18px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 24px 0;
`;

export const SubmitBoxTop = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SubmitBoxBottom = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SubmitText = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  font-size: 24px;
  font-weight: 500;
`;

export const SubmitPrice = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  font-size: 16px;
  font-weight: 400;
`;

export const UploadButton = styled.div`
  font-size: 16px;
  border: 1px solid #d3d3d3;
  color: #883cbe;
  border-radius: 200px;
  cursor: pointer;
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  &:hover {
    background-color: #fbfbfbff;
  }
`;

export const FileInput = styled.input`
  width: 100%;
  height: 100%;
  opacity: 0;
  position: absolute;
  cursor: pointer;
`;

export const SubmitButton = styled.button`
  font-size: 16px;
  color: #ffffff;
  background-color: #883cbe;
  border: none;
  border-radius: 200px;
  cursor: pointer;
  width: 100%;
  height: 40px;
  opacity: 0.9;

  &:hover {
    opacity: 1;
  }
`;

export const FilePreviewArea = styled.div`
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
  margin-bottom: 4px;
  max-height: 180px;
  overflow-y: auto;
`;

export const FileBox = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border: 1px solid #d3d3d3;
  border-radius: 10px;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-size: 12px;
  text-align: center;
  color: #444;
  transition: all 0.2s ease;
  animation: ${fadeInScale} 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  &:hover button {
    opacity: ${(props) => (props.isSubmitted ? 0 : 1)};
  }
`;

export const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const FileIcon = styled.img`
  width: 30px;
  height: 30px;
  opacity: 0.6;
  margin-bottom: 6px;
`;

export const FileName = styled.div`
  width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px;
`;

export const RemoveFileButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 12px;
  cursor: ${(props) => (props.isSubmitted ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.isSubmitted ? 0 : 0)};
  transition: opacity 0.2s ease;

  &:hover {
    background: ${(props) => (props.isSubmitted ? "rgba(0,0,0,0.6)" : "red")};
  }
`;

export const TopLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const ProjectSettingsIcon = styled(Image)`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

export const MoreBox = styled.div`
  position: absolute;
  top: 100px;
  right: 100px;
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
  transition: background-color 0.2s ease;
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

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  text-align: center;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
`;

export const CancelButton = styled.button`
  width: 120px;
  height: 40px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: #ccc;
  color: #333;
`;
