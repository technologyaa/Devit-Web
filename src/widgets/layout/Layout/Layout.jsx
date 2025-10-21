import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import SideBarFolded from "../SideBar/SideBarFolded";
import { Wrapper } from "./styles/layout";

const Layout = () => {
  const location = useLocation();

  const isChatPage = location.pathname.startsWith("/chat");

  return (
    <Wrapper>
      {isChatPage ? <SideBarFolded /> : <SideBar />}
      <Outlet />
    </Wrapper>
  );
};

export default Layout;
