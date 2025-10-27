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
  color: #111;
  display: flex;
  align-items: flex-end;
  gap: 24px;
`;

export const Bottom = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  display: flex;
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
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const Banner = styled.div`
  width: 100%;
  height: 220px;
  background-color: #e0e0e0;
  border-radius: 12px;
`;

export const TaskBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TaskBox = styled.div`
  width: 72%;
  height: 72px;
  border: 1px solid #d3d3d3;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 18px;
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

export const DescriptionText = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #333;
`;

export const SubmitBox = styled.div`
  width: 320px;
  height: 210px;
  border: 1px solid #d3d3d3;
  border-radius: 12px;
  display: flex;
  gap: 18px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
`;

export const FileInput = styled.input`
  width: 258px;
  height: 42px;
  border-radius: 200px;
  opacity: 0;
  position: absolute;
  cursor: pointer;
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
