import styled from "styled-components";
import { Image } from "@/styles/Image";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

export const Frame = styled.div`
  width: 88%;
  height: 93%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Top = styled.div`
  font-size: 26px;
  font-weight: 500;
  color: #111;
`;

export const Bottom = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  display: flex;
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
