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
  gap: 24px;
`;

export const Top = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const TextSearch = styled.div``;

export const DevSearch = styled.div`
  display: flex;
  justify-content: center;
`;

export const DevText = styled.div`
  font-size: 26px;
  font-weight: 500;
`;

export const SearchBox = styled.div`
  display: flex;
  padding: 14px;
  padding-left: 16px;
  border-radius: 24px;
  border: 1px solid #cccccc;
  width: 32vw;
  display: flex;
  gap: 10px;
`;

export const SearchIcon = styled.img`
  width: 14px;
`;

export const Search = styled.input`
  border: none;
  outline: none;
  width: 100vw;
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
`;

export const Position = styled.div`
  display: flex; /* 카테고리 항목들을 가로로 나열 */
  gap: 10px; /* 항목 간의 간격 */
`;

export const CategoryButton = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  // props로 active 상태를 받아 스타일을 변경합니다.
  background-color: ${(props) => (props.$active ? "#883CBE" : "#FCFCFC")};
  color: ${(props) => (props.$active ? "white" : "#2F2F2F")};
  border: 1px solid ${(props) => (props.$active ? "#883CBE" : "#CCCCCC")};
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
`;

// 신규 추가: 드롭다운 버튼 모형
export const DropdownButton = styled.button`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #cccccc;
  background-color: white;
  font-size: 14px;
  color: #2f2f2f;
  cursor: pointer;
  font-weight: 500;

  display: flex;
  align-items: center;
  gap: 4px;
`;
// ⭐️ 개발자 목록 컨테이너 (DevUser 업데이트)
export const DevUser = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
`;

// ⭐️ 개별 개발자 카드 (이미지 디자인 반영)
export const DeveloperCard = styled.div`
  width: 100%;
  max-width: 180px;
  height: 250px; /* 이미지 높이에 맞게 조정 */
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  cursor: pointer;
`;

// ⭐️ 프로필 이미지 영역 (카드 상단 절반 차지)
export const ProfileArea = styled.div`
  width: 100%;
  height: 100%; /* 카드 상단 60% 차지 */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: 30px; /* 텍스트 크기 */
  font-weight: 700;
  color: white;

  /* 실제 이미지를 사용한다면 이 부분을 조정해야 합니다. */
  background-image: ${(props) =>
    props.$profileUrl ? `url(${props.$profileUrl})` : "none"};
  background-size: cover;
  background-position: center;
`;

export const ProfileImg = styled.img`
  width: 100%;
  border: solid 1px #cccccc;
  border-radius: 0.625rem;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none; // 사진 드래그 방지
`;

// ⭐️ 온도 표시 막대 색상 로직 (0~100 기준)
const getTemperatureColor = (temp) => {
  // temp >= 75 (높음, COLOR_STOPS의 75, 100 지점 색상 반영)
  if (temp >= 75) return "rgb(220, 60, 60)";

  // temp >= 50 (중간 높음, COLOR_STOPS의 50 지점 색상 반영)
  if (temp >= 50) return "rgb(240, 120, 120)";

  // temp >= 36.5 (보통, COLOR_STOPS의 36.5 지점 색상 반영)
  if (temp >= 36.5) return "rgb(255, 149, 43)";

  // temp >= 30 (낮음, COLOR_STOPS의 30 지점 색상 반영)
  if (temp >= 30) return "rgb(240, 200, 100)";

  // temp >= 15 (매우 낮음, COLOR_STOPS의 15 지점 색상 반영)
  if (temp >= 15) return "rgb(100, 180, 240)";

  // temp < 15 (최저, COLOR_STOPS의 0 지점 색상 반영)
  return "rgb(70, 120, 240)";
};

// ⭐️ 온도 표시 막대 (사진 오른쪽 위)
export const TemperatureBar = styled.div`
  position: absolute;
  top: 10px; /* 상단에서 띄우기 */
  right: 10px; /* 오른쪽에서 띄우기 */
  width: 60px; /* 막대 전체 길이 */
  height: 8px; /* 막대 두께 */
  background-color: #e0e0e0; /* 배경색 */
  border-radius: 4px; /* 끝을 둥글게 */
  overflow: hidden; /* 내부 차오르는 부분이 막대 영역을 벗어나지 않도록 */
  z-index: 10; /* 다른 요소 위에 오도록 */

  &::after {
    content: "";
    display: block;
    height: 100%;
    width: ${(props) => props.$temp}%; /* temp 값에 따라 너비 결정 */
    background-color: ${(props) => getTemperatureColor(props.$temp)};
    transition: width 0.3s ease-out; /* 너비 변경 시 부드러운 전환 */
    border-radius: 4px; /* 차오르는 부분도 둥글게 */
  }
`;

// ⭐️ 카드 하단 정보 영역
export const CardInfoArea = styled.div`
  width: 100%;
  height: 30%; /* 카드 하단 40% 차지 */
  padding-top: 10px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 3px;
`;

export const PersonalInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const CardName = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #2f2f2f;
  margin-bottom: 2px;
`;

export const CardJob = styled.div`
  font-size: 14px;
  color: #000000;
  margin-bottom: 4px;
`;

export const CardInfo = styled.div`
  font-size: 14px;
  color: #555555;
  line-height: 1.3;
  height: 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
