import * as S from "./styles/shopPage";
import { Helmet } from "react-helmet";
import profiles from "@/data/profile";
import { useState } from "react";

const SHOP = [
  "크레딧 구매",
  "구독 플랜"
]

const CREDIT = [
  {
    credit: "1,000", // 1000 크래딧
    won: "10,000"
  },
  {
    credit: "10,000", // 10000 크래딧
    won: "100,000"
  },
  {
    credit: "100,000", // 10000 크래딧
    won: "1,000,000"
  }
]

const userCredit = profiles[0].credit;

// '구독 플랜' 탭을 위한 더미 컴포넌트
const SubscriptionPlan = () => (
    <S.CreditBox style={{ padding: 0 }}> 
      <S.BoxText>구독 플랜 패키지</S.BoxText>
      <div style={{ padding: '40px 20px', textAlign: 'center', height: '280px' }}>
        <p style={{ fontSize: '18px', color: '#696969' }}>
          현재 구독 플랜 컨텐츠 준비 중입니다.
        </p>
        <p style={{ marginTop: '10px', fontSize: '16px', color: '#B0B0B0' }}>
          나중에 실제 구독 플랜 패키지 카드들로 대체해주세요.
        </p>
      </div>
    </S.CreditBox>
);

export default function ShopPage() {
  // 'selectedShop' 상태 정의. 초기값은 "크레딧 구매"
  const [selectedShop, setSelectedShop] = useState(SHOP[0]);

  // 버튼 클릭 핸들러
  const handleShopClick = (shopName) => {
    setSelectedShop(shopName);
  };

  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="./assets/Helmet.svg"></link>
      </Helmet>
      <S.Container>
        <S.Frame>
          <S.ShopText>상점</S.ShopText>
          <S.TopAndCredit>
            <S.Top>
              <S.ShopButtonFrame>
                {SHOP.map((shop) => (
                  <S.ShopButton
                    key={shop}
                    onClick={() => handleShopClick(shop)}
                    $isSelected={selectedShop === shop}
                  >
                    {shop}
                  </S.ShopButton>
                ))}
              </S.ShopButtonFrame>
              
              {/* 👈 변경된 부분: "크레딧 구매" 일 때만 현재 보유 크래딧 섹션 렌더링 */}
              {selectedShop === "크레딧 구매" && (
                <S.HaveCredit>
                  <S.TextFrame>
                    <S.HaveCreditText
                      FontSize={"22px"}
                      FontWeight={"600"}>
                      현재 보유 크래딧
                    </S.HaveCreditText>
                    <S.HaveCreditText
                      FontSize={"28px"}
                      FontWeight={"600"}>
                      {userCredit}{" "}<S.SpanText>크래딧</S.SpanText>
                    </S.HaveCreditText>
                    <S.CreditHistoryFrame>
                      <S.CreditHistoryBtn> {/*사용 내역 보기 버튼*/}
                        사용 내역 보기
                      </S.CreditHistoryBtn>
                      <S.CreditHistoryBtn> {/*충전 내역 버튼*/}
                        충전 내역
                      </S.CreditHistoryBtn>
                    </S.CreditHistoryFrame>
                  </S.TextFrame>
                  <S.Cricle>

                  </S.Cricle>
                  <S.Cricle second>
                    
                  </S.Cricle>
                </S.HaveCredit>
              )}
            </S.Top>

            {/* 선택된 탭에 따라 하단 컨텐츠 조건부 렌더링 (기존 로직 유지) */}
            {selectedShop === "크레딧 구매" ? (
              <S.CreditBox>
                  <S.BoxText>
                    크레딧 패키지
                  </S.BoxText>

                  <S.CardContainer>
                    {CREDIT.map((item, index) => (
                      <S.CreditCard key={index}>
                        <S.BoxTop>
                          <S.TextContainer>
                          <S.CreditText 
                            FontSize={"32px"} 
                            FontWeight={"600"} 
                            Color={"#883CBE"}
                          >
                            {item.credit}
                          </S.CreditText>
                          <S.CreditText 
                            FontSize={"16px"} 
                            FontWeight={"500"}
                            Color={"#696969"}
                            PaddingBottom={"2px"}
                          >
                            크레딧
                          </S.CreditText>
                        </S.TextContainer>
                        <div>
                          <S.CreditText 
                            FontSize={"26px"} 
                            FontWeight={"600"}
                          >
                            ₩{item.won}
                          </S.CreditText>
                        </div>
                        </S.BoxTop>
                        <S.PurchaseButton>
                          지금 구매
                        </S.PurchaseButton>
                      </S.CreditCard>
                    ))}
                  </S.CardContainer>
              </S.CreditBox>
            ) : (
              <SubscriptionPlan />
            )}

          </S.TopAndCredit>
        </S.Frame>
      </S.Container>
    </>
  );
}