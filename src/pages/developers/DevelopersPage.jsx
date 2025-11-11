import * as S from "./styles/developersPage";
import { Helmet } from "react-helmet";
import { useState } from "react";

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

export default function DevelopersPage() {

  const [selectedCategory, setSelectedCategory] = useState("전체");

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    // 여기서 선택된 카테고리에 따른 데이터 필터링 로직을 추가할 수 있습니다.
    console.log(`Selected category: ${category}`);
  };
  
  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="./assets/Helmet.svg"></link>
      </Helmet>
      <S.Container>
        <S.Frame>
          <S.DevText>개발자</S.DevText>
          <S.DevSearch>
            <S.SearchBox>
              <S.SearchIcon src="/public/assets/Search.svg"></S.SearchIcon>
              <S.Search type="search" placeholder="검색어를 입력해주세요."></S.Search>
            </S.SearchBox>
          </S.DevSearch>
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
          
          <S.FilterGroup>
                <S.DropdownButton>
                    전체 경력 <span style={{fontSize: '10px'}}>▼</span>
                </S.DropdownButton>
          </S.FilterGroup>

          </S.Category>
          
        </S.Frame>
      </S.Container>
    </>
  );
}
