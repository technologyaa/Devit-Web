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
  gap: 16px;
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
