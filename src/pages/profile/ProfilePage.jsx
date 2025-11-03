import * as S from "./styles/profilePage";
import { Helmet } from "react-helmet";
import { useState } from "react";
import profiles from "@/data/profile";

const cToHex = (c) => Math.round(c).toString(16).padStart(2, '0');
const lerp = (a, b, t) => a + (b - a) * t;

const COLOR_STOPS = [
    { temp: 0, color: { r: 70, g: 120, b: 240 } },
    { temp: 15, color: { r: 100, g: 180, b: 240 } },
    { temp: 30, color: { r: 240, g: 200, b: 100 } },
    { temp: 36.5, color: { r: 255, g: 149, b: 43 } },
    { temp: 50, color: { r: 240, g: 120, b: 120 } },
    { temp: 75, color: { r: 245, g: 105, b: 105 } },
    { temp: 100, color: { r: 220, g: 60, b: 60 } },
];

const getTempColor = (currentValue, maxValue = 100) => {
    const value = parseFloat(currentValue) || 0;
    const max = parseFloat(maxValue);
    const temp = Math.min(Math.max(value, 0), max);

    const findColor = (idx) => `#${cToHex(COLOR_STOPS[idx].color.r)}${cToHex(COLOR_STOPS[idx].color.g)}${cToHex(COLOR_STOPS[idx].color.b)}`;

    if (temp <= 0) return findColor(0);
    if (temp >= max) return findColor(COLOR_STOPS.length - 1);

    for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
        const stop1 = COLOR_STOPS[i];
        const stop2 = COLOR_STOPS[i + 1];

        if (temp >= stop1.temp && temp <= stop2.temp) {
            const t = (temp - stop1.temp) / (stop2.temp - stop1.temp);
            
            const r = lerp(stop1.color.r, stop2.color.r, t);
            const g = lerp(stop1.color.g, stop2.color.g, t);
            const b = lerp(stop1.color.b, stop2.color.b, t);
            
            return `#${cToHex(r)}${cToHex(g)}${cToHex(b)}`;
        }
    }
    return findColor(COLOR_STOPS.length - 1);
};

const Progress = (currentValue, maxValue) => {
  const value = parseFloat(currentValue);
  const max = parseFloat(maxValue);

  if (isNaN(value) || isNaN(max) || max <= 0) return "0%";

  const percentage = (value / max) * 100;
  return `${Math.min(percentage, 100)}%`
}

export default function ProfilePage() {
  
  const [myProfiles, setMyProfiles] = useState(profiles);
  const profile = myProfiles[0]; 
  
  const projectsCount = profile.CompletedProjects || "0";
  const tempValue = profile.Temp || "0";

  const completedProjectsWidth = Progress(projectsCount, 20); // 최대 프로젝트 길이
  const tempWidth = Progress(tempValue, 100); // 최대 온도 
  const tempColor = getTempColor(tempValue, 100);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const newImageUrl = URL.createObjectURL(file);

      // setMyProfiles 함수를 사용하여 myProfiles 상태 업데이트
      setMyProfiles((prevProfiles) => {
        const newProfiles = [...prevProfiles];

        const updatedProfile = { 
          ...newProfiles[0],
          img: newImageUrl
        };

        newProfiles[0] = updatedProfile;

        return newProfiles;
      });
      event.target.value = null;
    }
  }
  
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
              <S.ProfileInfo> 
                <S.ImgContainer>
                  <S.ProfileImg src={profile.img} alt="프로필 이미지" />
                  <S.CameraIcon src="/assets/camera-icon.svg" />
                </S.ImgContainer>
                <S.NameContainer>
                  <S.Name>{profile.id}</S.Name>
                  <S.Job>{profile.job}</S.Job>
                </S.NameContainer>
              </S.ProfileInfo>
              <S.EditButton>
                프로필 변경
                <S.ProfileButton type="file" accept="image/*" onChange={handleImageChange} />
              </S.EditButton>
              <S.PersonalInfo>
                <S.EmailInfo>
                    <S.Email>이메일</S.Email>
                    <S.PersonalEmail>{profile.email}</S.PersonalEmail>
                </S.EmailInfo>
              </S.PersonalInfo>
            </S.Profile>
            <S.TopRight>
                <S.StatBox>
                    <S.StatValue>{profile.CompletedProjects}</S.StatValue>
                    <S.StatLabel>완료한 프로젝트</S.StatLabel>
                    <S.ProgressBarContainer>
                        <S.ProgressBar width={completedProjectsWidth} color="#4D96FF" />
                    </S.ProgressBarContainer>
                </S.StatBox>
                <S.StatBox>
                    <S.StatValue>{profile.Temp}°C</S.StatValue>
                    <S.StatLabel>온도</S.StatLabel>
                    <S.ProgressBarContainer>
                        <S.ProgressBar width={tempWidth} color={tempColor} />
                    </S.ProgressBarContainer>
                </S.StatBox>
            </S.TopRight>

            <S.BottomRight>
                <S.SectionTitle>프로젝트 목록</S.SectionTitle>
                <S.ProjectList>
                    {profile.projectList.map((project, index) => (
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