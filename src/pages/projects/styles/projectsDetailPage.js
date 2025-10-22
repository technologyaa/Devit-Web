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
