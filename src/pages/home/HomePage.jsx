import * as S from "./styles/homePage";
import { Helmet } from "react-helmet";
import devlopers from "@/data/developer-list";
import icons from "@/data/icon-list";
import { Link } from "react-router";

const gradients = {};

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
                <S.NameText TextColor={"#883CBE"}>개발</S.NameText>과{" "}

                <S.NameText TextColor={"#D4AAF3"}>기획</S.NameText>을 잇다
              </S.Name>
              <S.Cricle1></S.Cricle1>
              <S.Cricle2></S.Cricle2>
            </S.Top>
            <S.Middle>
              <S.Text>바로가기</S.Text>
              <S.Goto>
                {icons.map((icon, index) => {
                  return (
                    <S.styledLink to={icon.url}>
                      <S.Card gradient={icon.gradient}>
                        <S.ElementPlace>
                          <S.IconButton>
                            <S.Icon
                              src={icons[index].logo}
                              alt="프로젝트바로가기 아이콘"
                            ></S.Icon>
                            <S.Button>바로 가기</S.Button>
                          </S.IconButton>
                          <S.ElementName>
                            {icons[index].name}
                          </S.ElementName>
                          <S.ElementInfo>
                            {icons[index].text}
                          </S.ElementInfo>
                        </S.ElementPlace>
                      </S.Card>
                    </S.styledLink>
                  );
                })}
              </S.Goto>
            </S.Middle>
          </S.TopMiddleWrap>
          <S.Bottom>
            <S.Text>추천 개발자</S.Text>
            <S.RecommendDev>
              {devlopers.map((devloper, index) => {
                return (
                  <S.Devloper>
                    <S.Profile
                      src="./assets/dummy-profile.svg"
                      alt="개발자 프로필"
                    ></S.Profile>

                    <S.DevAndJob>
                      <S.NameAndJobText
                        FontSize={"clamp(16px, 1.2vw, 20px)"}
                        FontWeight={"440"}>
                        {devloper.name}
                      </S.NameAndJobText>
                      <S.NameAndJobText
                        FontSize={"clamp(14px, 1vw, 18px)"}>
                        {devloper.job}
                      </S.NameAndJobText>
                    </S.DevAndJob>

                    <S.NameAndJobText FontSize={"12px"} TextColor={"#747474"}>
                      {devloper.text}
                    </S.NameAndJobText>
                  </S.Devloper>
                );
              })}
            </S.RecommendDev>
          </S.Bottom>
        </S.Frame>
      </S.Container >
    </>
  );
}
