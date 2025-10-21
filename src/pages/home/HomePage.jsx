import * as S from "./styles/homePage";
import { Helmet } from "react-helmet";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="/assets/devit-logo(Di).png"></link>
      </Helmet>
      <S.Container>
        <S.Frame>
          <S.Topmiddlewrap>
            <S.Top>
              <S.Name><span style={{ color: "#883CBE" }}>개발</span>과 <span style={{ color: "#D4AAF3" }}>기획</span>을 잇다</S.Name>
              <S.Cricle1></S.Cricle1>
              <S.Cricle2></S.Cricle2>
            </S.Top>
            <S.Middle></S.Middle>
          </S.Topmiddlewrap>
          <S.Bottom></S.Bottom>
        </S.Frame>
      </S.Container>
    </>
  );
}
