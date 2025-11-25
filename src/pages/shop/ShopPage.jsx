import * as S from "./styles/shopPage";
import { Helmet } from "react-helmet";
import profiles from "@/data/profile";
import { Link } from "react-router";
import { useState } from "react";

const SUBSCRIPTION_PLANS = [
  {
    title: "무료 플랜",
    price: "₩0",
    period: "",
    features: [
      "단일 개발자 매칭",
      "개인 의뢰자 적합",
      "소규모·단순 프로젝트",
    ],
    borderColor: "#a8a8a8",
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
    borderColor: "#AB66DD",
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
    borderColor: "#8748B5",
  }
];

const userCredit = profiles[0].credit;


// SubscriptionPlan 컴포넌트: 상태와 핸들러를 prop으로 전달받아 사용
const SubscriptionPlan = ({ currentUserPlan, handlePlanChange, SUBSCRIPTION_PLANS }) => (
  <S.CreditBox style={{ padding: 0 }}>
    <S.BoxText>
      구독 플랜 패키지
    </S.BoxText>
    <S.SubscriptionCardContainer>
      {SUBSCRIPTION_PLANS.map((plan, index) => {

        // 현재 플랜 상태에 따라 버튼 텍스트를 결정
        const getButtonText = () => {
          if (plan.title === currentUserPlan) {
            return "내 플랜";
          }

          // SUBSCRIPTION_PLANS 배열 순서를 이용해 플랜의 '레벨'을 비교
          const currentPlanIndex = SUBSCRIPTION_PLANS.findIndex(p => p.title === currentUserPlan);
          const planIndex = index;

          if (planIndex > currentPlanIndex) {
            return "플랜 업그레이드"; // 현재보다 인덱스가 크면 업그레이드
          } else if (planIndex < currentPlanIndex) {
            return "플랜 다운그레이드"; // 현재보다 인덱스가 작으면 다운그레이드
          }
          return "";
        };

        const buttonText = getButtonText();
        const isCurrentPlan = plan.title === currentUserPlan;
        const isClickable = !isCurrentPlan;

        return (
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

            <S.UpgradeButton
              // 스타일 결정을 위해 prop 전달
              $isCurrentPlan={isCurrentPlan}
              // 클릭 가능한 경우에만 핸들러 적용
              onClick={isClickable ? () => handlePlanChange(plan.title) : undefined}
              // 현재 플랜일 경우 버튼 비활성화
              disabled={isCurrentPlan}
            >
              {buttonText}
            </S.UpgradeButton>
          </S.SubscriptionCard>
        );
      })}
    </S.SubscriptionCardContainer>
  </S.CreditBox>
);

export default function ShopPage() {
  const [currentPlan, setCurrentPlan] = useState(profiles[0].plan);

  const handlePlanChange = (newPlan) => {
    if (newPlan === currentPlan) {
      return;
    }

    // profiles.js에서 불러온 데이터 원본 업데이트 (메모리 내 객체 변경)
    profiles[0].plan = newPlan;

    // React 상태 업데이트
    setCurrentPlan(newPlan);
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
              <S.HaveCredit>
                <S.TextFrame>
                  <S.TextButton>
                    <S.HaveCreditText
                      FontSize={"22px"}
                      FontWeight={"600"}>
                      현재 보유 크래딧
                    </S.HaveCreditText>
                    <Link to="/shop/credit">
                      <S.GoCredit src="/assets/Arrow.svg" />
                    </Link>
                  </S.TextButton>

                  <S.HaveCreditText
                    FontSize={"28px"}
                    FontWeight={"600"}>
                    {userCredit}{" "}<S.SpanText>크래딧</S.SpanText>
                  </S.HaveCreditText>
                </S.TextFrame>
                <S.Cricle>

                </S.Cricle>
                <S.Cricle second>

                </S.Cricle>
              </S.HaveCredit>
            </S.Top>

            {/* 2. 구독 플랜 패키지 (SubscriptionPlan) - 항상 표시 */}
            <SubscriptionPlan
              currentUserPlan={currentPlan}
              handlePlanChange={handlePlanChange}
              SUBSCRIPTION_PLANS={SUBSCRIPTION_PLANS}
            />
          </S.TopAndCredit>
        </S.Frame>
      </S.Container>
    </>
  );
}