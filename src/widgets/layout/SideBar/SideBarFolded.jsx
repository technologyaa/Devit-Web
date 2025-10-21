import * as S from "./styles/sideBarFolded";
import { Link, useLocation } from "react-router-dom";

const menu = [
  { url: "/home", logo: "/assets/home-icon.svg", alt: "홈 아이콘" },
  { url: "/projects", logo: "/assets/folder-icon.svg", alt: "프로젝트 아이콘" },
  { url: "/chat", logo: "/assets/chat-icon.svg", alt: "채팅 아이콘" },
  { url: "/offer/dev", logo: "/assets/dev-icon.svg", alt: "개발자 아이콘" },
  { url: "/shop", logo: "/assets/shop-icon.svg", alt: "상점 아이콘" },
  { url: "/profile", logo: "/assets/profile-icon.svg", alt: "프로필 아이콘" },
];

export default function SideBarFolded() {
  const location = useLocation();

  return (
    <S.Container>
      <S.Top>
        <S.LogoBox>
          <Link to="/home">
            <S.DevitLogo src="/assets/DI-logo.svg" alt="로고" />
          </Link>
        </S.LogoBox>

        <S.Navigation>
          <S.NavigationWrapper>
            <S.NavigationTop>
              {menu.map((item) => (
                <Link key={item.url} to={item.url}>
                  <S.MenuItem
                    selected={location.pathname.match(item.url)}
                    type="button"
                  >
                    <S.MenuIcon src={item.logo} alt={item.alt} />
                  </S.MenuItem>
                </Link>
              ))}
            </S.NavigationTop>

            <S.NavigationBottom>
              <S.MenuItem onClick={() => alert("아직 개발 중입니다.")}>
                <S.MenuIcon src="/assets/setting-icon.svg" alt="설정 아이콘" />
              </S.MenuItem>
            </S.NavigationBottom>
          </S.NavigationWrapper>
        </S.Navigation>
      </S.Top>
    </S.Container>
  );
}
