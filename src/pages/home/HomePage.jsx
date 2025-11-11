import * as S from "./styles/homePage";
import { Helmet } from "react-helmet";
import developers from "@/data/developer-list";
import icons from "@/data/icon-list";
import { Link } from "react-router";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="./assets/Helmet.svg" />
      </Helmet>
      <S.Container>
        <S.Frame>
          <S.TopMiddleWrap>
            <S.Top>
              <S.Name>
                <span style={{ color: "#883CBE" }}>개발</span>과{" "}
                <span style={{ color: "#D4AAF3" }}>기획</span>을 잇다
              </S.Name>
              <S.Cricle1></S.Cricle1>
              <S.Cricle2></S.Cricle2>
            </S.Top>

            <S.Middle>
              <p style={{ fontSize: "26px", fontWeight: "500" }}>바로가기</p>
              <S.Goto>
                {icons.map((icon, index) => (
                  <S.styledLink key={index} to={icon.url}>
                    <S.Card gradient={icon.gradient}>
                      <S.ElementPlace>
                        <S.IconButton>
                          <S.Icon
                            src={icon.logo}
                            alt="프로젝트 바로가기 아이콘"
                          />
                          <S.Button>바로 가기</S.Button>
                        </S.IconButton>
                        <p
                          style={{
                            color: "white",
                            fontSize: "25px",
                            fontWeight: "500",
                          }}
                        >
                          {icon.name}
                        </p>
                        <p style={{ color: "white", fontSize: "16px" }}>
                          {icon.text}
                        </p>
                      </S.ElementPlace>
                    </S.Card>
                  </S.styledLink>
                ))}
              </S.Goto>
            </S.Middle>
          </S.TopMiddleWrap>

          <S.Bottom>
            <p style={{ fontSize: "26px", fontWeight: "500" }}>추천 개발자</p>
            <S.RecommendDev>
              {developers.map((developer, index) => (
                <S.Devloper key={index}>
                  <S.Profile
                    src="./assets/dummy-profile.svg"
                    alt="개발자 프로필"
                  />
                  <S.DevAndJob>
                    <p
                      style={{
                        fontSize: "clamp(16px, 1.2vw, 20px)",
                        fontWeight: "440",
                      }}
                    >
                      {developer.name}
                    </p>
                    <p style={{ fontSize: "clamp(14px, 1vw, 18px)" }}>
                      {developer.job}
                    </p>
                  </S.DevAndJob>
                  <p style={{ fontSize: "12px", color: "#747474" }}>
                    {developer.text}
                  </p>
                </S.Devloper>
              ))}
            </S.RecommendDev>
          </S.Bottom>
        </S.Frame>
      </S.Container>
    </>
  );
}
