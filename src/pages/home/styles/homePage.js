import styled from "styled-components";
import { Image } from "@/styles/Image";
import { Link } from "react-router";

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

export const TopMiddleWrap = styled.div``;

export const Top = styled.div`
  width: 100%;
  height: 160px;
  position: relative;
  overflow: hidden;
`;

export const Middle = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const Card = styled.div`
  height: 170px;
  background: ${(props) => props.gradient};
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Goto = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: stretch;
  align-items: stretch;
`;

export const styledLink = styled(Link)`
  display: block;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: inherit;
`;

export const Bottom = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const Name = styled.div`
  font-size: 50px;
  font-weight: 600;
  position: absolute;
  top: 30px;
`;

export const Cricle1 = styled.div`
  position: absolute;
  top: -145px;
  right: 50px;
  background-color: rgba(171, 102, 221, 0.7);
  width: 250px;
  height: 250px;
  border-radius: 100%;
`;

export const Cricle2 = styled.div`
  position: absolute;
  top: -200px;
  right: -130px;
  background-color: rgba(136, 60, 190, 0.4);
  width: 340px;
  height: 340px;
  border-radius: 100%;
`;

export const ElementPlace = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 0 20px;
`;
export const IconButton = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Icon = styled.img`
  width: 2.75rem;
  height: 2.75rem;
  aspect-ratio: 1/1;
`;

export const Button = styled.div`
  background-color: #bf79ff;
  width: 90px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  color: white;
`;

export const RecommendDev = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 25px;
`;

export const Devloper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const ProfileWrapper = styled.div`
  width: 100%;
  padding-bottom: 100%; /* 1:1 비율 강제 */
  height: 0;
  position: relative;
  overflow: hidden;
  border-radius: 0.625rem;
  border: 1px solid #ccc;
`;

export const Profile = styled(Image)`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;
// 온도에 따른 색상 반환 (DevelopersPage와 동일한 기준)
const getTemperatureColor = (temp) => {
  if (temp >= 75) return "rgb(220, 60, 60)";
  if (temp >= 50) return "rgb(240, 120, 120)";
  if (temp >= 36.5) return "rgb(255, 149, 43)";
  if (temp >= 30) return "rgb(240, 200, 100)";
  if (temp >= 15) return "rgb(100, 180, 240)";
  return "rgb(70, 120, 240)";
};

export const TempBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: ${(props) =>
    props.$temp != null ? getTemperatureColor(props.$temp) : "#9b3fee"};
  color: #fff;
  font-weight: 600;
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 999px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  z-index: 2;
`;

// 온도를 막대 형태로 보여주는 컴포넌트 (DevelopersPage와 동일한 스타일)
export const TemperatureBar = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 60px;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  z-index: 10;

  &::after {
    content: "";
    display: block;
    height: 100%;
    width: ${(props) => (props.$temp != null ? String(props.$temp) : "0")}%;
    background-color: ${(props) =>
      props.$temp != null ? getTemperatureColor(props.$temp) : "#9b3fee"};
    transition: width 0.3s ease-out;
    border-radius: 4px;
  }
`;

export const DevAndJob = styled.div`
  width: 100%;
  display: flex;
  height: 2.3rem;
  justify-content: space-between;
  align-items: center;
`;

export const Text = styled.p`
  font-size: 26px;
  font-weight: 500;
  color: black;
`;

export const NameText = styled.span`
  color: ${(props) => props.TextColor};
`;

export const ElementName = styled.p`
  color: white;
  font-size: 25px;
  font-weight: 500;
`;

export const ElementInfo = styled.p`
  color: white;
  font-size: 16px;
`;

export const NameAndJobText = styled.p`
  font-size: ${(props) => props.FontSize};
  font-weight: ${(props) =>
    props.FontWeight >= 1 ? props.FontWeight : "16px"};
  color: ${(props) => (props.TextColor == null ? "#000000" : props.TextColor)};
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 580px;
  padding: 40px 36px 20px;
  box-sizing: border-box;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ModalWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
`;

export const ModalTitle = styled.div`
  width: 100%;
  display: flex;
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 20px;
`;

export const ProjectInputBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ProjectInputText = styled.div`
  width: 100%;
  display: flex;
  font-size: 16px;
  font-weight: 500;
`;

export const ProjectInput = styled.input`
  width: 100%;
  height: 46px;
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
  gap: 8px;
  justify-content: flex-end;
  margin-top: 12px;
`;

export const JobSelectGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

export const JobBox = styled.div`
  color: ${(props) => (props.isSelected ? "#9B3FEE" : "black")};
  border-radius: 10px;
  border: ${(props) =>
    props.isSelected ? "1.4px solid #883cbe" : "1.4px solid #ccc"};
  background: ${(props) =>
    props.isSelected ? "rgba(136,60,190,0.08)" : "white"};
  cursor: pointer;
  transition: 0.15s ease;
  user-select: none;
  box-sizing: border-box;
  position: relative;
  height: 95px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  &:hover {
    background: #f8f5fb;
  }
`;

export const JobIcon = styled.img`
  width: 20px;
  margin-bottom: 12px;
`;

export const CheckIcon = styled.img`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
`;

export const JobFrame = styled.div`
  gap: 6px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
