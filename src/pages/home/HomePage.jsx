import * as S from "./styles/homePage";
import { Helmet } from "react-helmet";

const icons = [
  {
    url: "/projects",
    logo: "/assets/white_folder.svg",
    alt: "폴더 아이콘",
    text: "새로운 프로젝트 시작",
    name: "프로젝트",
    gradient: 'linear-gradient(270deg, #9636EB 0.15%, #A651F5 99.87%)',
  },
  {
    url: "/offer/dev",
    logo: "/assets/white-people.svg",
    alt: "개발자 아이콘",
    text: "개발자찾기",
    name: "개발자",
    gradient: 'linear-gradient(90deg, #C083FC 0%, #AA57F7 100%)',
  },
  {
    url: "/shop",
    logo: "/assets/white-shop.svg",
    alt: "상점 아이콘",
    text: "코인 & 유료플랜",
    name: "상점",
    gradient: 'linear-gradient(90deg, #D6B0FF 0%, #BF86FC 100%)',
  }
]

const gradients = {

}

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
            <S.Middle>
              <p style={{ fontSize: "26px", fontWeight: '500' }}>바로가기</p>
              <S.Goto>
                {icons.map((icon, index) => {
                  return (
                  <S.Card gradient={icon.gradient}>
                    <S.Gocontainer>
                      <S.Iconbutton>
                        <S.Icon src={icons[index].logo} alt="프로젝트바로가기 아이콘"></S.Icon>
                        <S.Button>바로 가기</S.Button>
                      </S.Iconbutton>
                      <p style={{ color: "white", fontSize: "25px", fontWeight: "500" }}>{icons[index].name}</p>
                      <p style={{ color: "white", fontSize: '16px' }}>{icons[index].text}</p>
                    </S.Gocontainer>
                  </S.Card>);
                })}
              </S.Goto>
            </S.Middle>
          </S.Topmiddlewrap>
          <S.Bottom>
            <p style={{ fontSize: "26px", fontWeight: "500" }}>추천 개발자</p>
            <S.RecommendDev>
            </S.RecommendDev>
          </S.Bottom>
        </S.Frame>
      </S.Container>
    </>
  );
}
