import styled from "styled-components";
import { Image } from "@/styles/Image";

export const Container = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
`;

export const Frame = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  height: 100%;
`;

export const Top = styled.div`
  font-size: 26px;
  font-weight: 500;
  color: #111;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const Bottom = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
`;

export const Box = styled.div`
  width: 260px;
  height: 200px;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  cursor: pointer;
  gap: 4px;
`;

export const Thumbnail = styled(Image)`
  width: 100%;
  height: 160px;
  border-radius: 18px;
  object-fit: cover;
`;

export const BoxBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #000;
`;

export const Owner = styled.div`
  font-size: 16px;
  color: #000;
`;

export const PlusButton = styled(Image)`
  width: 20px;
  cursor: pointer;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 420px;
  padding: 40px 0px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
`;

export const ModalWrapper = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

export const ModalTitle = styled.div`
  width: 100%;
  display: flex;
  font-size: 22px;
  font-weight: 500;
`;

export const ProjectInputBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ProjectInputText = styled.div`
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
`;

export const ProjectPictureBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const ProjectPictureText = styled.div`
  width: 100%;
  display: flex;
  font-size: 16px;
  font-weight: 500;
`;

export const ProjectPictureLabel = styled.label`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

export const ProjectPictureInput = styled.input`
  display: none;
`;

export const ProjectPicture = styled(Image)`
  width: 180px;
  height: 110px;
  background-clip: padding-box;
  margin-top: 10px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e6e6e6;
`;

export const CancelButton = styled.button`
  background: #eee;
  border: none;
  border-radius: 6px;
  width: 48%;
  height: 40px;
  cursor: pointer;
  &:hover {
    background: #ddd;
  }
`;

export const CreateButton = styled.button`
  background: #eee;
  border: none;
  border-radius: 6px;
  width: 48%;
  height: 40px;
  cursor: pointer;
  &:hover {
    background: #ddd;
  }
`;

export const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
