import * as S from "./styles/developersPage";
import { Helmet } from "react-helmet";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Alarm } from "@/toasts/Alarm";
import users from "@/data/user-list";
import { API_URL, getImageUrl } from "@/constants/api";
import ReactDropdown from "react-dropdown";
import "react-dropdown/style.css";
import axios from "axios";
import Cookies from "js-cookie";

// 직무 카테고리
const CATEGORIES = ["전체", "웹", "서버", "Android", "iOS", "게임", "디자인"];

const truncateText = (text, maxLength = 15) => {
  if (!text) return "";
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

// 카테고리와 API major 매핑
const CATEGORY_TO_MAJOR = {
  웹: "FRONTEND",
  서버: "BACKEND",
  Android: "ANDROID",
  iOS: "IOS",
  게임: "GAME",
  디자인: "DESIGN",
};

// 정렬 옵션 정의
const sortOptions = [
  { value: "default", label: "기본" },
  { value: "temp_desc", label: "온도높은순" },
  { value: "temp_asc", label: "온도낮은순" },
];

export default function DevelopersPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [developers, setDevelopers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 정렬 상태 관리
  const [sortOption, setSortOption] = useState(sortOptions[0]);

  const navigate = useNavigate();

  // 개발자 목록 조회 함수
  // currentSortOption을 인자로 받아 API 엔드포인트를 결정합니다.
  const fetchDevelopers = async (major, currentSortOption) => {
    try {
      setIsLoading(true);
      const token = Cookies.get("accessToken");
      const headers = {
        Accept: "application/json",
      };

      if (token && token !== "logged-in") {
        headers["Authorization"] = `Bearer ${token}`;
      }

      let url;
      let params = {};

      // [수정됨] 정렬 옵션이 온도 관련이면 /developers/temperature API 사용
      if (
        currentSortOption === "temp_desc" ||
        currentSortOption === "temp_asc"
      ) {
        url = `${API_URL}/developers/temperature`;
        // min 파라미터: 최소 온도 이상의 개발자 조회 (전체 조회를 위해 0 또는 1 설정)
        // API 기본값이 30이므로, 정렬을 위해 전체를 불러오려면 0으로 설정하는 것이 안전합니다.
        params = { min: 0 };
      } else {
        // 기본 상태면 기존 API 사용
        url = `${API_URL}/auth/developers`;
      }

      console.log(`Fetching developers from: ${url}`, params);

      const response = await axios.get(url, {
        headers: headers,
        params: params, // query parameter 추가
        withCredentials: true,
      });

      let data = [];
      // 응답 데이터 구조 처리 (API마다 다를 수 있으므로 방어 코드 유지)
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      } else if (
        response.data?.data &&
        typeof response.data.data === "object"
      ) {
        data = [response.data.data];
      }

      // 데이터 포맷팅
      let formattedDevelopers = data
        .map((dev, index) => {
          const memberId = dev.memberId || dev.id;
          // memberId가 없으면 해당 개발자를 제외하거나 경고
          if (!memberId) {
            console.warn(`Developer at index ${index} has no memberId:`, dev);
          }

          // API 응답 필드명 차이 대응 (major vs Major vs developerInfo.major)
          const majorField =
            dev.major ||
            dev.Major ||
            dev.majorField ||
            dev.developerInfo?.major ||
            null;

          // 이미지 URL 처리 및 로깅
          const rawImagePath = dev.profile;
          const processedImageUrl = getImageUrl(rawImagePath);
          if (index < 3) {
            // 처음 몇 개만 로그 출력
            console.log(
              `Developer ${index} image - raw:`,
              rawImagePath,
              "processed:",
              processedImageUrl
            );
          }

          return {
            id: memberId,
            name:
              dev.githubId ||
              dev.username ||
              (memberId ? `개발자 ${memberId}` : `개발자 ${index}`),
            job: majorField || "BACKEND",
            img: processedImageUrl || "/assets/dummy-profile.svg",
            info: dev.introduction || "",
            temp: dev.temperature || 0, // 온도 필드 매핑
            memberId: memberId,
            originalMajor: majorField,
          };
        })
        .filter((dev) => dev.id);

      // 클라이언트 측 카테고리 필터링
      if (major && major !== "전체") {
        const apiMajor = CATEGORY_TO_MAJOR[major];
        if (apiMajor) {
          formattedDevelopers = formattedDevelopers.filter(
            (dev) => dev.job === apiMajor
          );
        }
      }

      setDevelopers(formattedDevelopers);
    } catch (error) {
      console.error("Failed to fetch developers:", error);
      // 에러 발생 시 더미 데이터 혹은 빈 배열
      setDevelopers(users || []);
    } finally {
      setIsLoading(false);
    }
  };

  // [수정됨] 카테고리나 정렬 옵션이 바뀔 때마다 데이터를 새로 가져옵니다.
  useEffect(() => {
    fetchDevelopers(selectedCategory, sortOption.value);
  }, [selectedCategory, sortOption]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleCardClick = (userId) => {
    const developer = developers.find(
      (d) => d.id === userId || d.memberId === userId
    );
    const profileId = developer?.memberId || developer?.id || userId;

    if (developer) {
      const majorValue = developer.originalMajor || developer.job;
      sessionStorage.setItem(
        "currentDeveloperInfo",
        JSON.stringify({
          id: profileId,
          major: majorValue,
          githubId: developer.name,
        })
      );
    }

    navigate(`/profile/${profileId}`);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    // useEffect가 의존성 배열에 sortOption을 가지고 있으므로 자동으로 fetchDevelopers가 실행됩니다.
  };

  const displayedUsers = useMemo(() => {
    let sortedList = [...developers];

    if (sortOption.value === "temp_desc") {
      // 온도 높은순 (내림차순)
      sortedList.sort((a, b) => b.temp - a.temp);
    } else if (sortOption.value === "temp_asc") {
      // 온도 낮은순 (오름차순)
      sortedList.sort((a, b) => a.temp - b.temp);
    }
    // 'default'인 경우 API에서 받아온 순서 유지

    return sortedList;
  }, [developers, sortOption]);

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
                  <S.Search
                    type="search"
                    placeholder="검색어를 입력해주세요."
                  ></S.Search>
                </S.SearchBox>
              </S.DevSearch>
            </S.TextSearch>

            <S.Category>
              <S.Position>
                {CATEGORIES.map((category) => (
                  <S.CategoryButton
                    key={category}
                    $active={selectedCategory === category}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </S.CategoryButton>
                ))}
              </S.Position>
              <S.DropdownWrapper>
                <ReactDropdown
                  options={sortOptions}
                  onChange={handleSortChange}
                  value={sortOption}
                  placeholder="정렬 선택"
                />
              </S.DropdownWrapper>
            </S.Category>
          </S.Top>

          <S.DevUser>
            {isLoading ? (
              <div style={{ padding: "20px", textAlign: "center" }}>
                로딩 중...
              </div>
            ) : displayedUsers.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center" }}>
                개발자가 없습니다.
              </div>
            ) : (
              displayedUsers.map((user) => (
                <S.DeveloperCard
                  key={user.id}
                  onClick={() => handleCardClick(user.id)}
                >
                  <S.ProfileArea>
                    <S.TemperatureBar $temp={user.temp} />
                    <S.ProfileImg
                      src={user.img || "/assets/dummy-profile.svg"}
                      onError={(e) => {
                        console.error(
                          "Developer image failed to load:",
                          user.img
                        );
                        if (e.target.src !== "/assets/dummy-profile.svg") {
                          e.target.src = "/assets/dummy-profile.svg";
                        }
                      }}
                      onLoad={() => {
                        console.log(
                          "Developer image loaded successfully:",
                          user.img
                        );
                      }}
                    />
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
