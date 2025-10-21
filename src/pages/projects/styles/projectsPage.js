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
