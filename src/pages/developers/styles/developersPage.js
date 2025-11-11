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
  border: 1px solid #ccc;
`;

export const DevSearch = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
`;

export const DevText = styled.div`
  font-size: 26px;
  font-weight: 500;
`;

export const SearchBox = styled.div`
  display: flex;
  padding: 10px;
  padding-left: 16px;
  border-radius: 24px;
  border: 1px solid #CCCCCC;
  width: 32vw;
  display: flex;
  gap: 10px
`;

export const SearchIcon = styled.img`
  width: 14px;
`;

export const Search = styled.input`
  border: none;
  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
    display: none;
  }

  &::-ms-clear {
    display: none;
    width: 0;
    height: 0;
  }
`;

export const Category = styled.div`
  display: flex;
  justify-content: space-between; /* Position과 FilterGroup을 양 끝으로 배치 */
  align-items: center;
  padding-right: 20px; /* 오른쪽 여백 추가 */
`;

export const Position = styled.div`
  display: flex; /* 카테고리 항목들을 가로로 나열 */
  gap: 10px; /* 항목 간의 간격 */
  margin-top: 20px;
  margin-left: 20px; /* 좌측 여백 */
`;

export const CategoryButton = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  // props로 active 상태를 받아 스타일을 변경합니다.
  background-color: ${(props) => (props.$active ? "#883CBE" : "#F5F5F5")};
  color: ${(props) => (props.$active ? "white" : "#2F2F2F")};
  border: 1px solid ${(props) => (props.$active ? "#883CBE" : "#F5F5F5")};
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.9;
  }
`;

// 신규 추가: 필터 그룹 스타일
export const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* 체크박스와 드롭다운 사이 간격 */
  margin-top: 20px; /* 카테고리와 동일하게 상단 여백 부여 */
`;

// 신규 추가: 드롭다운 버튼 모형
export const DropdownButton = styled.button`
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid #CCCCCC;
    background-color: white;
    font-size: 14px;
    color: #2F2F2F;
    cursor: pointer;
    font-weight: 500;
    
    display: flex;
    align-items: center;
    gap: 4px;
`;