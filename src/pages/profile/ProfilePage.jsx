import * as S from "./styles/profilePage";
import { Helmet } from "react-helmet";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL, getImageUrl } from "@/constants/api";
import axios from "axios";
import Cookies from "js-cookie";
import { Alarm } from "@/toasts/Alarm";

// --- 유틸리티 함수 (색상, 온도 계산) ---
const cToHex = (c) => Math.round(c).toString(16).padStart(2, "0");
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

  const findColor = (idx) =>
    `#${cToHex(COLOR_STOPS[idx].color.r)}${cToHex(COLOR_STOPS[idx].color.g)}${cToHex(COLOR_STOPS[idx].color.b)}`;

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
  if (value < 0 || isNaN(value) || isNaN(max) || max <= 0) return "0%";
  const percentage = (value / max) * 100;
  return `${Math.min(percentage, 100)}%`;
};

const MAJOR_TO_DISPLAY = {
  "FRONTEND": "웹",
  "BACKEND": "서버",
  "ANDROID": "Android",
  "IOS": "iOS",
  "GAME": "게임",
  "DESIGN": "디자인"
};

const isSystemRole = (role) => role ? role.startsWith("ROLE_") : false;

const getDisplayJob = (major, role) => {
  if (major) {
    const majorStr = String(major).trim();
    const mapped = MAJOR_TO_DISPLAY[majorStr] || MAJOR_TO_DISPLAY[majorStr.toUpperCase()];
    return mapped || majorStr;
  }
  if (!major && role && !isSystemRole(role)) return role;
  return "";
};

// --- 메인 컴포넌트 ---
export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMyProfile, setIsMyProfile] = useState(!id);
  const [memberId, setMemberId] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get("accessToken");
      const headers = { "Accept": "application/json" };
      if (token && token !== "logged-in") headers["Authorization"] = `Bearer ${token}`;

      let baseData = {};
      let detailData = {};

      if (id) {
        // --- 타인 프로필 조회 ---
        try {
          const devRes = await axios.get(`${API_URL}/developers/${id}`, { headers, withCredentials: true });
          detailData = devRes.data?.data || devRes.data || {};
          if (detailData.memberId) setMemberId(detailData.memberId);
        } catch (e) {
          try {
             const listRes = await axios.get(`${API_URL}/auth/developers`, { headers, withCredentials: true });
             const list = listRes.data?.data || listRes.data || [];
             const found = list.find(d => String(d.id) === String(id) || String(d.memberId) === String(id));
             if (found) {
                 detailData = found;
                 setMemberId(found.memberId);
             }
          } catch(err) {}
        }

        const targetId = detailData.memberId || id;
        try {
          const userRes = await axios.get(`${API_URL}/profile/${targetId}`, { headers, withCredentials: true });
          baseData = userRes.data?.data || userRes.data || {};
        } catch (e) {
          baseData = { ...detailData };
        }

      } else {
        // --- 내 프로필 조회 ---
        const meRes = await axios.get(`${API_URL}/auth/me`, { headers, withCredentials: true });
        baseData = meRes.data?.data || meRes.data || {};
        
        const myId = baseData.memberId || baseData.id;
        
        if (myId) {
            try {
                const myDevRes = await axios.get(`${API_URL}/developers/${myId}`, { headers, withCredentials: true });
                detailData = myDevRes.data?.data || myDevRes.data || {};
            } catch (devErr) {
                console.warn("내 개발자 정보를 가져오지 못했습니다.");
            }
        }
      }

      // 데이터 병합
      const merged = { ...baseData, ...detailData };

      const displayJob = getDisplayJob(merged.major, merged.role);
      const rawImage = merged.profile || merged.profileImage || baseData.profile || baseData.profileImage;
      const processedImage = getImageUrl(rawImage);

      const projectList = merged.projectList || merged.projects || [];
      const projectCount = merged.career || merged.completedProjects || projectList.length || 0;
      const temperature = merged.temperature || merged.temp || 36.5;
      const introduction = merged.introduction || "";

      const finalProfile = {
        id: merged.username || merged.githubId || merged.name || "사용자",
        email: merged.email || "",
        job: displayJob,
        img: processedImage || "/assets/profile-icon.svg",
        CompletedProjects: String(projectCount),
        Temp: String(temperature),
        projectList: projectList,
        introduction: introduction,
        // githubId, blog는 화면에서 제외하지만 데이터는 유지 가능
      };

      setUserProfile(finalProfile);

    } catch (error) {
      console.error("Profile Load Error:", error);
      Alarm("❌", "프로필을 불러오는데 실패했습니다.", "#FF1E1E", "#FFEAEA");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setIsMyProfile(!id);
    setUserProfile(null);
    fetchProfile();
  }, [id, fetchProfile]);

  if (isLoading || !userProfile) {
    return (
      <S.Container>
        <S.Frame><div style={{ padding: "50px", textAlign: "center" }}>로딩 중...</div></S.Frame>
      </S.Container>
    );
  }

  const profile = userProfile;
  const projectsCount = profile.CompletedProjects;
  const tempValue = profile.Temp;
  
  const completedProjectsWidth = Progress(projectsCount, 20);
  const tempWidth = Progress(tempValue, 100);
  const tempColor = getTempColor(tempValue, 100);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const token = Cookies.get("accessToken");
      const formData = new FormData();
      formData.append("file", file);
      
      await axios.put(`${API_URL}/auth/profile/image`, formData, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      
      Alarm("✅", "프로필 사진이 변경되었습니다.", "#3CAF50", "#E8F5E9");
      fetchProfile();
    } catch (e) {
      Alarm("❌", "사진 변경 실패", "#FF1E1E", "#FFEAEA");
    }
  };

  const handleStartChat = async () => {
    if (!memberId && !id) return Alarm("❌", "대상 정보 없음", "#FF1E1E", "#FFEAEA");
    navigate("/chat");
  };

  return (
    <>
      <Helmet>
        <title>Devit - 프로필</title>
      </Helmet>
      <S.Container>
        <S.Frame>
          <S.ProfileText>{isMyProfile ? "나의 프로필" : "개발자 프로필"}</S.ProfileText>
          <S.ProfileGrid>
            {/* 왼쪽: 기본 정보 */}
            <S.Profile>
              <S.ProfileInfo>
                <S.ImgContainer>
                  <S.ProfileImg src={profile.img} alt="프로필" />
                  {isMyProfile && <S.CameraIcon src="/assets/camera-icon.svg" />}
                </S.ImgContainer>
                <S.NameContainer>
                  <S.Name>{profile.id}</S.Name>
                  <S.Job>{profile.job || "직무 미설정"}</S.Job>
                </S.NameContainer>
              </S.ProfileInfo>
              
              {isMyProfile && (
                <S.EditButton>
                  프로필 사진 변경
                  <S.ProfileButton type="file" accept="image/*" onChange={handleImageChange} />
                </S.EditButton>
              )}

              <S.PersonalInfo>
                <S.EmailInfo>
                  <S.Email>이메일</S.Email>
                  <S.PersonalEmail>{profile.email || "-"}</S.PersonalEmail>
                </S.EmailInfo>
                
                {/* 자기소개 */}
                <S.EmailInfo style={{ marginTop: "15px" }}>
                    <S.Email>소개</S.Email>
                    <S.PersonalEmail>
                        {profile.introduction || <span style={{color:"#aaa"}}>소개글이 없습니다.</span>}
                    </S.PersonalEmail>
                </S.EmailInfo>
                
              </S.PersonalInfo>
            </S.Profile>

            {/* 오른쪽 상단: 통계 (온도, 프로젝트 수) */}
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
                <S.StatLabel>매너 온도</S.StatLabel>
                <S.ProgressBarContainer>
                  <S.ProgressBar width={tempWidth} color={tempColor} />
                </S.ProgressBarContainer>
              </S.StatBox>
            </S.TopRight>

            {/* 오른쪽 하단: 프로젝트 목록 */}
            <S.BottomRight>
              <S.SectionTitle>참여 프로젝트</S.SectionTitle>
              <S.ProjectList>
                {profile.projectList && profile.projectList.length > 0 ? (
                  profile.projectList.map((project, index) => (
                    <S.ProjectItem key={index}>
                      <S.ProjectName>{project.name || project.title || "프로젝트"}</S.ProjectName>
                      <S.ProjectPoints>{project.points ? `${project.points} pts` : ""}</S.ProjectPoints>
                    </S.ProjectItem>
                  ))
                ) : (
                  <div style={{ padding: "30px", textAlign: "center", color: "#999" }}>
                    참여한 프로젝트 내역이 없습니다.
                  </div>
                )}
              </S.ProjectList>
              {!isMyProfile && (
                <S.ChatButton onClick={handleStartChat}>
                  이 개발자와 소통하러 가기
                </S.ChatButton>
              )}
            </S.BottomRight>
          </S.ProfileGrid>
        </S.Frame>
      </S.Container>
    </>
  );
}