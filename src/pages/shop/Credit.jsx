import * as S from "./styles/Credit.js";
import { Helmet } from "react-helmet";
import profiles from "@/data/profile";
import { useState } from "react";

const userCredit = profiles[0].credit;

const CREDIT = [
  {
    credit: "1,000",
    value: 1000,
    won: "9,900",
    icon: "/assets/coin-icon.svg",
    description: "기본 패키지",
    borderColor: "#b770ea"
  },
  {
    credit: "5,000",
    value: 5000,
    won: "45,000",
    icon: "/assets/coin2-icon.svg",
    description: "10% 할인",
    borderColor: "#AB66DD"
  },
  {
    credit: "10,000",
    value: 10000,
    won: "85,000",
    icon: "/assets/coins-icon.svg",
    description: "15% 할인",
    borderColor: "#883CBE"
  }
]

export default function CreditPage() {
  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="./assets/Helmet.svg"></link>
      </Helmet>
      <S.Container>
        <S.Frame>
          <S.ShopText>크레딧</S.ShopText>
          <S.TopAndCredit>
            <S.Top>
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
            </S.Top>

            <S.CreditBox>
              <S.BoxText>
                크레딧 패키지
              </S.BoxText>

              <S.CardContainer>
                {CREDIT.map((item, index) => (
                  <S.CreditCard key={index} $borderColor={item.borderColor}>

                    <S.BoxTop>

                      <S.TextContainer>
                        <S.CreditText
                          FontSize={"32px"}
                          FontWeight={"700"}
                          Color={"#883CBE"}
                        >
                          {item.credit}
                        </S.CreditText>

                        <S.CreditText
                          FontSize={"16px"}
                          FontWeight={"500"}
                          Color={"#696969"}
                          PaddingBottom={"3px"}
                        >
                          크레딧
                        </S.CreditText>
                      </S.TextContainer>


                      <S.CreditText
                        FontSize={"24px"}
                        FontWeight={"500"}
                        Color={"#404040"}
                      >
                        ₩{item.won}
                      </S.CreditText>

                      <S.CreditText
                        FontSize={"16px"}
                        FontWeight={"500"}
                        Color={item.description.includes('할인') ? "#4b295d" : "#883CBE"}
                        MarginBottom={"20px"}
                      >
                        {item.description}
                      </S.CreditText>

                    </S.BoxTop>
                    <S.CoinIcon src={item.icon}></S.CoinIcon>
                    <S.PurchaseButton>
                      지금 구매
                    </S.PurchaseButton>
                  </S.CreditCard>
                ))}
              </S.CardContainer>
            </S.CreditBox>
          </S.TopAndCredit>
        </S.Frame>
      </S.Container>
    </>
  );
}