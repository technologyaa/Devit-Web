import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import SideBarFolded from "../SideBar/SideBarFolded";
import * as S from "./styles/layout";
import { useEffect } from "react";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname == "/") navigate("/home");
  }, [location]);
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
