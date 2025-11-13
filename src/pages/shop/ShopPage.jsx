import * as S from "./styles/shopPage";
import { Helmet } from "react-helmet";
import profiles from "@/data/profile";

const SHOP = [
  "크레딧 구매",
  "구독 플랜"
]

const userCredit = profiles[0].credit; // 아직 서버 연결전 더미 데이터 하나

export default function ShopPage() {
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
                  <S.ShopButton>
                    {shop}
                  </S.ShopButton>
                ))}
              </S.ShopButtonFrame>
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
            </S.Top>
            <S.CreditBox>
                <S.BoxText>
                  크레딧 패키지
                </S.BoxText>
            </S.CreditBox>
          </S.TopAndCredit>
        </S.Frame>
      </S.Container>
    </>
  );
}
