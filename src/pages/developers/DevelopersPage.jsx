import * as S from "./styles/developersPage";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alarm } from "@/toasts/Alarm";
import users from "@/data/user-list";

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

export default function DevelopersPage() {

  const [selectedCategory, setSelectedCategory] = useState("전체");

  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    // 여기서 선택된 카테고리에 따른 데이터 필터링 로직을 추가할 수 있습니다.
  };

  const handleCardClick = (userId) => {
    // 요청하신 경로 형식 'profile/id'로 이동합니다.
    navigate(`/profile/${userId}`);
    console.log(`Navigating to profile: /profile/${userId}`);
  };

  const filteredUsers = users.filter((user) => {
    if (selectedCategory === "전체") {
      return true;
    }

    return user.job === selectedCategory;
  });

  const displayedUsers = filteredUsers;

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
                  <S.SearchIcon src="/public/assets/Search.svg"></S.SearchIcon>
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
            {displayedUsers.map((user) => (
              <S.DeveloperCard key={user.id} onClick={() => handleCardClick(user.id)}>
                <S.ProfileArea>
                  <S.TemperatureBar $temp={user.temp} />
                  <S.ProfileImg src={user.img}></S.ProfileImg>
                </S.ProfileArea>

                <S.CardInfoArea>
                  <S.CardName>{user.name}</S.CardName>
                  <S.CardJob>{user.job}</S.CardJob>
                  <S.CardInfo>{truncateText(user.info, 15)}</S.CardInfo>
                </S.CardInfoArea>
              </S.DeveloperCard>
            ))}
          </S.DevUser>
        </S.Frame>
      </S.Container>
    </>
  );
}