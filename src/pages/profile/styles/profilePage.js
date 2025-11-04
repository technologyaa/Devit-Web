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
  grid-template-rows: auto auto;
  gap: 20px;
  grid-template-areas: 
    "left top"
    "left bottom";
`;

export const Profile = styled.div`
  grid-area: left;
  background: #fff;
  border-radius: 12px;
  border: solid 1px #E5E7EB;
  padding: 30px 20px;
  display:flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  height: fit-content;
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
  position: relative;
`;

export const NameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

export const ProfileImg = styled(Image)`
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

export const ProfileButton = styled.input`
  width: 7.5rem;
  height: 2.5rem;
  border-radius: 200px;
  opacity: 0;
  position: absolute;
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

export const TopRight = styled.div`
  grid-area: top;
  display: flex;
  gap: 20px;
`;

export const StatBox = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const StatValue = styled.div`
  font-size: 36px;
  font-weight: 600;
  line-height: normal;
`;

export const StatLabel = styled.div`
  font-size: 14px;
  color: #555;
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  margin-top: 5px;
  overflow: hidden;
`;

export const ProgressBar = styled.div`
  height: 100%;
  width: ${(props) => props.width || "0%"}; 
  background-color: ${(props) => props.color || "#ccc"}; 
  border-radius: 3px;
  
  transition: width 0.5s ease-in-out, background-color 0.5s ease-in-out; 
`;

// --- 오른쪽 하단 (프로젝트 목록) ---
export const BottomRight = styled.div`
  grid-area: bottom;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  padding: 20px;
  height: 300px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 10px;
`;

export const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
  overflow-y: auto;
  padding-right: 20px;
`;

export const ProjectItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee; /* 목록 항목 아래 구분선 */

  &:last-child {
      border-bottom: none; /* 마지막 항목은 구분선 제거 */
      padding-bottom: 0;
  }
`;

export const ProjectName = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

export const ProjectPoints = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #AB66DD;
`;