import * as S from "./styles/sideBar";
import { Link, useLocation } from "react-router-dom";
import { Alarm } from "@/toasts/Alarm";
import toast, { Toaster } from "react-hot-toast";

const menu = [
  {
    url: "/home",
    logo: "/assets/home-icon.svg",
    alt: "홈 아이콘",
    text: "홈",
  },
  {
    url: "/projects",
    logo: "/assets/folder-icon.svg",
    alt: "폴더 아이콘",
    text: "프로젝트",
  },
  {
    url: "/chat",
    logo: "/assets/chat-icon.svg",
    alt: "채팅 아이콘",
    text: "채팅",
  },
  {
    url: "/offer/dev",
    logo: "/assets/dev-icon.svg",
    alt: "개발자 아이콘",
    text: "개발자",
  },
  {
    url: "/shop",
    logo: "/assets/shop-icon.svg",
    alt: "상점 아이콘",
    text: "상점",
  },
  {
    url: "/profile",
    logo: "/assets/profile-icon.svg",
    alt: "프로필 아이콘",
    text: "프로필",
  },
];

export default function SideBar() {
  const location = useLocation();

  return (
    <S.Container>
      <S.Top>
        <S.LogoBox>
          <Link to="/home">
            <S.DevitLogo
              src="/assets/devit-logo.svg"
              alt="logo image"
            ></S.DevitLogo>
          </Link>
        </S.LogoBox>
        <S.Navigation>
          <S.NavigationWrapper>
            <S.NavigationTop>
              {menu.map((item) => {
                return (
                  <>
                    <Link to={item.url}>
                      <S.MenuItem
                        key={item.text}
                        type="button"
                        selected={location.pathname.match(item.url)}
                        onClick={() => setSelectedMenu(item.text)}
                      >
                        <S.MenuIcon src={item.logo} alt={item.alt} />
                        <S.MenuText>{item.text}</S.MenuText>
                      </S.MenuItem>
                    </Link>
                  </>
                );
              })}
            </S.NavigationTop>
            <S.NavigationBottom>
              <S.MenuItem
                onClick={() => Alarm("🛠️", "아직 개발 중인 기능입니다!")}
              >
                <S.MenuIcon src="/assets/more-icon2.svg" alt="설정 아이콘" />
                <Toaster position="top-right" />
                <S.MenuText>더보기</S.MenuText>
              </S.MenuItem>
            </S.NavigationBottom>
          </S.NavigationWrapper>
        </S.Navigation>
      </S.Top>
    </S.Container>
  );
}
