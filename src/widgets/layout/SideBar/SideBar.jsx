import * as S from "./styles";
import { useState } from "react";

const menu = [
  {
    logo: "/assets/home-icon.svg",
    alt: "홈 아이콘",
    text: "홈",
  },
  {
    logo: "/assets/folder-icon.svg",
    alt: "폴더 아이콘",
    text: "프로젝트",
  },
  {
    logo: "/assets/chat-icon.svg",
    alt: "채팅 아이콘",
    text: "채팅",
  },
  {
    logo: "/assets/dev-icon.svg",
    alt: "개발자 아이콘",
    text: "개발자",
  },
  {
    logo: "/assets/shop-icon.svg",
    alt: "상점 아이콘",
    text: "상점",
  },
  {
    logo: "/assets/profile-icon.svg",
    alt: "프로필 아이콘",
    text: "프로필",
  },
];

export default function SideBar() {
  const [selectedMenu, setSelectedMenu] = useState("home");
  return (
    <S.Container>
      <S.Top>
        <S.LogoBox>
          <S.DevitLogo
            src="/assets/devit-logo.svg"
            alt="logo image"
          ></S.DevitLogo>
        </S.LogoBox>
        <S.Navigation>
          <S.NavigationWrapper>
            {menu.map((item) => {
              return (
                <S.MenuItem
                  key={item.text}
                  type="button"
                  selected={selectedMenu === item.text}
                  onClick={() => setSelectedMenu(item.text)}
                >
                  <S.MenuIcon src={item.logo} alt={item.alt} />
                  <S.MenuText>{item.text}</S.MenuText>
                </S.MenuItem>
              );
            })}
          </S.NavigationWrapper>
        </S.Navigation>
      </S.Top>
      <S.Bottom>
        <S.Credit></S.Credit>
        <S.Profile></S.Profile>
      </S.Bottom>
    </S.Container>
  );
}
