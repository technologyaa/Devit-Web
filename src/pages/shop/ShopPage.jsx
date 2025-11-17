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
    credit: "1,000",
    won: "10,000",
    icon: "/assets/coin-icon.svg"
  },
  {
    credit: "10,000",
    won: "100,000",
    icon: "/assets/coin2-icon.svg"
  },
  {
    credit: "100,000",
    won: "1,000,000",
    icon: "/assets/coins-icon.svg"
  }
]

const SUBSCRIPTION_PLANS = [
  {
    title: "무료 플랜",
    price: "₩0",
    period: "",
    features: [
      "당일 개발자 매칭",
      "개인 의뢰자 적합",
      "소규모·단순 프로젝트",
    ],
    borderColor: null, // 무료 플랜은 테두리 없음
  },
  {
    title: "프로 플랜",
    price: "₩7,900",
    period: "/Month",
    features: [
      "1~3명의 개발자 매칭",
      "팀 단위 협업 환경 고려",
      "복합 기술 스택 기반의 프로젝트",
    ],
    borderColor: "#AB66DD", // 프로 플랜 테두리 색상 적용
  },
  {
    title: "비즈니스 플랜",
    price: "₩28,900",
    period: "/Month",
    features: [
      "개발자 매칭에 제한 없음",
      "대규모 프로젝트",
      "기업 전용 관리 기능",
    ],
    borderColor: "#8748B5", // 비즈니스 플랜 테두리 색상 적용
  }
];

const userCredit = profiles[0].credit;

const SubscriptionPlan = () => (
    <S.CreditBox style={{ padding: 0 }}> 
      <S.BoxText>
        구독 플랜 패키지
      </S.BoxText>
      <S.SubscriptionCardContainer>
        {SUBSCRIPTION_PLANS.map((plan, index) => (
          <S.SubscriptionCard key={index} $borderColor={plan.borderColor}>
            <S.PlanHeader>
              <S.PlanTitle>{plan.title}</S.PlanTitle>
              <S.PriceText>
                {plan.price}
                {plan.period && <span>{plan.period}</span>}
              </S.PriceText>
            </S.PlanHeader>
            
            <S.FeatureList>
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </S.FeatureList>

            <S.UpgradeButton>
              플랜 업그레이드
            </S.UpgradeButton>
          </S.SubscriptionCard>
        ))}
      </S.SubscriptionCardContainer>
    </S.CreditBox>
);

export default function ShopPage() {
  const [selectedShop, setSelectedShop] = useState(SHOP[0]);

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
                      <S.CreditHistoryBtn>
                        사용 내역 보기
                      </S.CreditHistoryBtn>
                      <S.CreditHistoryBtn>
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
                        <S.CoinIcon src={item.icon}>
                        </S.CoinIcon>
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