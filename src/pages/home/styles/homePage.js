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

export const Profile = styled(Image)`
  width: 100%;
  object-fit: cover;
  border-radius: 0.625rem;
  border: 1px solid #ccc;
  aspect-ratio: 1 / 1;
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
`;
