import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

export const Frame = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 45px;
`;

export const ProfileText = styled.div`
  font-size: 26px;
  font-weight: 500;
`;

export const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr;
  gap: 20px;
  grid-template-areas: 
    "left top"
    "left bottom";
`;

export const Profile = styled.div`
  grid-area: left;
  background: #fff;
  border-radius: 12px;
  border: solid #E5E7EB;
  padding: 20px 0 130px;
  display:flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

export const TopInfo = styled.div`
  grid-area: top;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  background-color: black;
`;

export const ProjectList = styled.div`
  grid-area: bottom;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px
`;


export const ImgContainer = styled.div`
  width: 90px;
  height: 90px;
  overflow: visible;
  /* border-radius: 50%; */
  position: relative;
`;

export const NameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

export const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

export const Name = styled.div`
  font-size: 1.2rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export const Job = styled.div`
  color: #883CBE;
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export const EditButton = styled.button`
  display: flex;
  width: 7.5rem;
  height: 2.5rem;
  padding: 0.5rem 1.3125rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  border-radius: 0.5625rem;
  background-color: #ab66dd;
  color: #fff;
  font-size: .98rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  cursor: pointer;
`;

export const PersonalInfo = styled.div``;

export const EmailInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: px;
`;

export const Email = styled.div`
  color: #979797;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const PersonalEmail = styled.div``;

export const CameraIcon = styled.img`
  position: absolute;
  bottom: 0;   /* 프로필 이미지 아래쪽 모서리 */
  right: 0;    /* 오른쪽 끝 */
  width: 20px;
  height: 20px;
  z-index: 2;
  background-color: white;
  border-radius: 50%;
  padding: 4px;
  border: solid 1px #E5E7EB;
`;