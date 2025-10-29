import * as S from "./styles/profilePage";
import { Helmet } from "react-helmet";
import profiles from "@/data/profile";

const Progress = (currentValue, maxValue) => {
  const value = parseFloat(currentValue);
  const max = parseFloat(maxValue);

  if (isNaN(value) || isNaN(max) || max <= 0) return "0%";

  const percentage = (value / max) * 100;
  return `${Math.min(percentage, 100)}%`
}

export default function ProfilePage() {

  // 프로필에 데이터가 없을때 0으로 표기
  const projectsCount = profiles[0].CompletedProjects || "0";
  const completedProjectsWidth = Progress(profiles[0].CompletedProjects, 20); // 최대 20개

  const tempValue = profiles[0].Temp || "0";
  const tempWidth = Progress(profiles[0].Temp, 100); // 최대 100도

  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="./assets/Helmet.svg"></link>
      </Helmet>
      <S.Container>
        <S.Frame>
          <S.ProfileText>프로필</S.ProfileText>
          <S.ProfileGrid>
            <S.Profile>
              <S.ProfileInfo> {/*사진, 이름, 직무 컨테이너*/}
                <S.ImgContainer>{/*프로필 사진 컨테이너*/}
                  <S.ProfileImg src={profiles[0].img} alt="프로필 이미지" />
                  <S.CameraIcon src="/assets/camera-icon.svg" />
                </S.ImgContainer>
                <S.NameContainer> {/*이름, 직무 컨테이너*/}
                  <S.Name>{profiles[0].id}</S.Name>
                  <S.Job>{profiles[0].job}</S.Job>
                </S.NameContainer>
              </S.ProfileInfo>
              <S.EditButton>프로필 편집</S.EditButton>
              <S.PersonalInfo>
                <S.EmailInfo>
                  <S.Email>이메일</S.Email>
                  <S.PersonalEmail>{profiles[0].email}</S.PersonalEmail>
                </S.EmailInfo>
              </S.PersonalInfo>
            </S.Profile>
            <S.TopRight>
              <S.StatBox>
                <S.StatValue>{projectsCount}</S.StatValue>
                <S.StatLabel>완료한 프로젝트</S.StatLabel>
                <S.ProgressBarContainer>
                  <S.ProgressBar width={completedProjectsWidth} color="#4D96FF" />
                </S.ProgressBarContainer>
              </S.StatBox>
              <S.StatBox>
                <S.StatValue>{tempValue}°C</S.StatValue>
                <S.StatLabel>온도</S.StatLabel>
                <S.ProgressBarContainer>
                  <S.ProgressBar width={tempWidth} color="#FF8F4D" />
                </S.ProgressBarContainer>
              </S.StatBox>
            </S.TopRight>

            <S.BottomRight>
              <S.SectionTitle>프로젝트 목록</S.SectionTitle>
              <S.ProjectList>
                {profiles[0].projectList.map((project, index) => (
                  <S.ProjectItem key={index}>
                    <S.ProjectName>{project.name}</S.ProjectName>
                    <S.ProjectPoints>{project.points}</S.ProjectPoints>
                  </S.ProjectItem>
                ))}
              </S.ProjectList>
            </S.BottomRight>
          </S.ProfileGrid>
        </S.Frame>
      </S.Container>
    </>
  );
}
