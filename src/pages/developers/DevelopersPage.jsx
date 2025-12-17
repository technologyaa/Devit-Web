import * as S from "./styles/developersPage";
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alarm } from "@/toasts/Alarm";
import users from "@/data/user-list";
import { API_URL } from "@/constants/api";
import axios from "axios";
import Cookies from "js-cookie";

// 직무 카테고리
const CATEGORIES = [
  "전체",
  "웹",
  "서버",
  "Android",
  "iOS",
  "게임",
  "디자인",
];

const truncateText = (text, maxLength = 15) => {
  if (text.length > maxLength) {
    // 15글자까지 자르고 '...'을 추가합니다.
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

// 카테고리와 API major 매핑
const CATEGORY_TO_MAJOR = {
  "웹": "FRONTEND",
  "서버": "BACKEND",
  "Android": "ANDROID",
  "iOS": "IOS",
  "게임": "GAME",
  "디자인": "DESIGN"
};

export default function DevelopersPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [developers, setDevelopers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 개발자 목록 조회
  const fetchDevelopers = async (major = null) => {
    try {
      setIsLoading(true);
      const token = Cookies.get("accessToken");
      const headers = {
        "Accept": "application/json"
      };
      
      if (token && token !== "logged-in") {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // /auth/developers 엔드포인트 사용
      let url = `${API_URL}/auth/developers`;
      // 전공별 필터링은 클라이언트 측에서 처리하거나, /developers/major/{major} 사용
      // 일단 /auth/developers로 전체 조회 후 필터링
      
      console.log("Fetching developers from:", url);
      const response = await axios.get(url, {
        headers: headers,
        withCredentials: true
      });

      console.log("Developers API Response:", response);
      console.log("Response Data:", response.data);
      console.log("Response Data Type:", typeof response.data);
      console.log("Is Array:", Array.isArray(response.data));

      // 스웨거 응답: 배열 또는 { "status": 0, "data": [...] }
      let data = [];
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      } else if (response.data?.data && typeof response.data.data === 'object') {
        // 단일 객체인 경우 배열로 변환
        data = [response.data.data];
      } else {
        console.warn("Unexpected response format:", response.data);
      }
      
      console.log("Parsed data:", data);
      console.log("Data length:", data.length);

      // API 응답을 UI 형식으로 변환
      let formattedDevelopers = data.map((dev, index) => {
        console.log(`Developer ${index}:`, dev);
        console.log(`Developer ${index} keys:`, Object.keys(dev));
        console.log(`Developer ${index} full:`, JSON.stringify(dev, null, 2));
        
        const memberId = dev.memberId || dev.id;
        // memberId가 없으면 해당 개발자를 제외하거나 경고
        if (!memberId) {
          console.warn(`Developer at index ${index} has no memberId:`, dev);
        }
        
        // major를 다양한 방법으로 찾기
        const major = dev.major || dev.Major || dev.majorField || dev.developerInfo?.major || null;
        console.log(`Developer ${index} major:`, major);
        
        return {
          id: memberId, // memberId만 사용 (없으면 undefined)
          name: dev.githubId || dev.username || (memberId ? `개발자 ${memberId}` : `개발자 ${index}`),
          job: major || "BACKEND", // major가 없으면 기본값
          img: dev.profile || "/assets/dummy-profile.svg",
          info: dev.introduction || "",
          temp: dev.temperature || 0,
          memberId: memberId, // 원본 memberId도 저장
          originalMajor: major // 원본 major 값 저장 (없으면 null)
        };
      }).filter(dev => dev.id); // memberId가 없는 개발자는 제외

      // 전공별 필터링 (클라이언트 측)
      if (major && major !== "전체") {
        const apiMajor = CATEGORY_TO_MAJOR[major];
        if (apiMajor) {
          formattedDevelopers = formattedDevelopers.filter(
            (dev) => dev.job === apiMajor
          );
        }
      }

      console.log("Formatted developers:", formattedDevelopers);
      setDevelopers(formattedDevelopers);
    } catch (error) {
      console.error("Failed to fetch developers:", error);
      if (error.response) {
        console.error("Server Error Data:", error.response.data);
        console.error("Server Error Status:", error.response.status);
      }
      // 에러 시 기본 데이터 사용
      setDevelopers(users);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleCardClick = (userId) => {
    console.log("Navigating to profile with userId:", userId);
    const developer = developers.find(d => d.id === userId || d.memberId === userId);
    console.log("Full developer data:", developer);
    // memberId가 있으면 memberId를 사용, 없으면 id 사용
    const profileId = developer?.memberId || developer?.id || userId;
    console.log("Navigating to profile with profileId:", profileId);
    
    // 개발자 정보를 sessionStorage에 저장하여 프로필 페이지에서 사용
    if (developer) {
      // originalMajor가 있으면 사용, 없으면 job 사용 (job은 이미 BACKEND 등으로 저장되어 있음)
      const majorValue = developer.originalMajor || developer.job;
      sessionStorage.setItem('currentDeveloperInfo', JSON.stringify({
        id: profileId,
        major: majorValue, // 원본 major 값 사용
        githubId: developer.name
      }));
      console.log("Saved to sessionStorage:", {
        id: profileId,
        major: majorValue,
        githubId: developer.name,
        "developer.originalMajor": developer.originalMajor,
        "developer.job": developer.job
      });
    }
    
    navigate(`/profile/${profileId}`);
  };

  const displayedUsers = developers;

  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="./assets/Helmet.svg"></link>
      </Helmet>
      <S.Container>
        <S.Frame>
          <S.Top>
            <S.TextSearch>
              <S.DevText>개발자</S.DevText>
              <S.DevSearch>
                <S.SearchBox>
                  <S.SearchIcon src="/assets/Search.svg"></S.SearchIcon>
                  <S.Search type="search" placeholder="검색어를 입력해주세요."></S.Search>
                </S.SearchBox>
              </S.DevSearch>
            </S.TextSearch>

            <S.Category>
              <S.Position>
                {CATEGORIES.map((category) => (
                  <S.CategoryButton
                    key={category}
                    // $active prop으로 선택 상태 전달 (styled-components에서 DOM 요소로 전달되지 않도록 $를 붙임)
                    $active={selectedCategory === category}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </S.CategoryButton>
                ))}
              </S.Position>

              <S.FilterGroup onClick={() => Alarm("🛠️", "아직 개발중인 기능입니다.")}>
                <S.DropdownButton>
                  전체 경력 <span style={{ fontSize: '10px' }}>▼</span>
                </S.DropdownButton>
              </S.FilterGroup>
            </S.Category>
          </S.Top>

          <S.DevUser>
            {isLoading ? (
              <div style={{ padding: "20px", textAlign: "center" }}>로딩 중...</div>
            ) : displayedUsers.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center" }}>개발자가 없습니다.</div>
            ) : (
              displayedUsers.map((user) => (
                <S.DeveloperCard key={user.id} onClick={() => handleCardClick(user.id)}>
                  <S.ProfileArea>
                    <S.TemperatureBar $temp={user.temp} />
                    <S.ProfileImg src={user.img}></S.ProfileImg>
                  </S.ProfileArea>

                  <S.CardInfoArea>
                    <S.PersonalInfo>
                      <S.CardName>{user.name}</S.CardName>
                      <S.CardJob>{user.job}</S.CardJob>
                    </S.PersonalInfo>
                    <S.CardInfo>{truncateText(user.info, 15)}</S.CardInfo>
                  </S.CardInfoArea>
                </S.DeveloperCard>
              ))
            )}
          </S.DevUser>
        </S.Frame>
      </S.Container>
    </>
  );
}