import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import SideBarFolded from "../SideBar/SideBarFolded";
import * as S from "./styles/layout";

const Layout = () => {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat");

  return (
    <S.Wrapper isChatPage={isChatPage}>
      {isChatPage ? <SideBarFolded /> : <SideBar />}
      <S.Content>
        <Outlet />
      </S.Content>
    </S.Wrapper>
  );
};

export default Layout;
