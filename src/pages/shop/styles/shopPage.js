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
  gap:35px;
`;

export const TopAndCredit = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px
`;

export const Top = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ShopText = styled.div`
  font-size: 26px;
  font-weight: 500;
`;

export const ShopButtonFrame = styled.div`
  height: 4rem;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 22px;
  border: 1px solid #B0B0B0;
  background: #FFF;
  padding: 10px
`;

export const ShopButton = styled.button`
  width: 100%;
  height: 100%;
  padding: 10px;
  font-size: 20px;
  font-weight: 500;
  background: #883CBE;
  color: #ffff;
  border-radius: 12px;

  width: 100%;
  height: 100%;
  padding: 10px;
  font-size: 20px;
  font-weight: 500;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
  border: none; // 기본 border 제거

  background: ${(props) => (props.$isSelected ? "#883CBE" : "transparent")};
  color: ${(props) => (props.$isSelected ? "#ffff" : "#696969")};

  &:hover {
    background: ${(props) => (props.$isSelected ? "#883CBE" : "#f0f0f0")}; 
    color: ${(props) => (props.$isSelected ? "#ffff" : "#000")};
  }
`;

export const HaveCredit = styled.div`
  width: 100%;
  height: 13rem;
  border-radius: 22px;
  border: 2px solid #DBDBDB;
  background: #A63CBE;
  position: relative;
  overflow: hidden; /* 원형 요소가 넘치는 부분은 숨깁니다 */
`;

export const TextFrame = styled.div`
  padding: 30px 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative; /* 텍스트가 원형 위에 오도록 설정 */
  z-index: 2;
`;

export const HaveCreditText = styled.p`
  color: white;
  font-size: ${(props) => props.FontSize};
  font-weight: ${(props) => props.FontWeight};
`;

export const CreditBox = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 1.25rem;
  border: 1px solid #B0B0B0;
  background: #FFF;
  box-sizing: border-box;
  overflow: hidden;
`;

export const SpanText = styled.span`
  font-size: 16px;
`;

export const CreditHistoryFrame = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
`;

export const CreditHistoryBtn = styled.button`
  font-size: 16px;
  border-radius: 0.625rem;
  border: 1px solid #D1D1D1;
  background: rgba(226, 187, 255, 0.50);
  color: #ffffff;
  padding: 12px 17px;
  cursor: pointer;
`;

export const Cricle = styled.div`
  position: absolute; /* 절대 위치 지정 */
  width: 280px; 
  height: 280px; 
  border-radius: 50%; /* 원형 */
  background: rgba(171, 102, 221, 0.60); /* 기본 배경색 */
  bottom: -40px; /* HaveCredit 영역 밖으로 나가도록 조정 */
  right: -140px; /* HaveCredit 영역 밖으로 나가도록 조정 */
  z-index: 1; /* 텍스트 아래에 배치 */


  /* 두 번째 원을 위한 스타일 */
  ${(props) => props.second && `
    width: 280px;
    height: 300px;
    background: rgba(171, 102, 221, 0.60); /* 첫 번째 원보다 연하게 */
    bottom: -150px;
    right: -70px;
    z-index: 0; /* 가장 아래에 배치 */
  `}
`;
export const BoxText = styled.div`
  font-size: 18px;
  font-weight: 550;
  border-bottom: solid 1px #B0B0B0;
  display: flex;
  align-items: center;
  padding: 24px 20px;
`;

export const CardContainer = styled.div`
  padding:20px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px; /* 카드 사이의 간격 */
  box-sizing: border-box;
`;

export const CreditCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px 10px;
  height: 18rem;
  border-radius: 1.25rem;
  border: 1px solid #B0B0B0;
  background: #FFF;
  text-align: center;
`;

export const TextContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

export const CreditText = styled.span`
  font-size: ${(props) => props.FontSize};
  font-weight: ${(props) => props.FontWeight};
  color: ${(props) => props.Color || '#000'};
  padding-bottom: ${(props) => props.PaddingBottom || 0}
`;

export const PurchaseButton = styled.button`
  width: 90%;
  padding: 15px 0;
  background: #883CBE;
  color: #ffff;
  font-size: 18px;
  font-weight: 500;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #6a2e99;
  }
`;
export const BoxTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// ... (이후 스타일 코드)