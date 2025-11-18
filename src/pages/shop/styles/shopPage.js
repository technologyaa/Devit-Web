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
  border: none;

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
  overflow: hidden;
`;

export const TextFrame = styled.div`
  padding: 30px 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
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
  position: absolute;
  width: 280px; 
  height: 280px; 
  border-radius: 50%;
  background: rgba(171, 102, 221, 0.60);
  bottom: -40px;
  right: -140px;
  z-index: 1;

  ${(props) => props.second && `
    width: 280px;
    height: 300px;
    background: rgba(171, 102, 221, 0.60);
    bottom: -150px;
    right: -70px;
    z-index: 0;
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
  gap: 20px;
  box-sizing: border-box;
`;

export const CreditCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 30px 20px; /* 상하 패딩 조정 */
  height: 20rem; /* 높이 조정 */
  border-radius: 1.25rem;
  border: 1px solid #B0B0B0; /* 기본 테두리 유지 */
  background: #FFF;
  text-align: center;
  position: relative;
  overflow: hidden;
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
  align-items: center;
  gap: 20px;
`;

export const CoinIcon = styled.img`
  width: 24%
`;

export const SubscriptionCardContainer = styled.div`
  padding: 20px;
  width: 100%;
  /* 카드를 가로로 3개 배치하도록 grid 설정 유지 */
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
  gap: 20px;
  box-sizing: border-box;
`;

export const SubscriptionCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 30px 25px;
  height: 18rem;
  border-radius: 1.25rem;
  border: 1px solid #B0B0B0;
  background: #FFF;
  position: relative;
  overflow: hidden;

  /* $borderColor 값에 따라 테두리와 그림자 동적 적용 */
  ${(props) => props.$borderColor && `
    border: 2px solid ${props.$borderColor};
    /* 테두리 색상을 기반으로 그림자 효과 적용 (50은 투명도) */
    box-shadow: 0 0 15px ${props.$borderColor}50; 
  `}
`;

export const PlanHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const PlanTitle = styled.h3`
  font-size: 20px;
  font-weight: 500;
  color: #333;
`;

export const PriceText = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #000;
  white-space: nowrap;

  span {
    font-size: 16px;
    font-weight: 500;
    color: #696969;
    margin-left: 5px;
  }
`;

export const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 15px 0 15px 0; /* 상하 마진 조정 */
  /* flex-grow 제거: 높이가 고정되었으므로 남은 공간을 차지할 필요 없음 */

  li {
    display: flex;
    align-items: flex-start;
    font-size: 15px;
    color: #444;
    margin-bottom: 10px; /* 아이템 간격 줄임 */
  }

  li::before {
    content: '✓';
    color: #883CBE;
    font-weight: bold;
    margin-right: 8px;
    font-size: 18px;
    line-height: 1.2;
  }
`;

export const UpgradeButton = styled.button`
  width: 100%;
  padding: 15px 0;
  background: #000;
  color: #ffff;
  font-size: 18px;
  font-weight: 500;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 10px;

  &:hover {
    background: #333;
  }
`;