import SideBar from "../SideBar/SideBar";
import { Wrapper } from "./styles/layout";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Wrapper>
      <SideBar />
      <Outlet />
    </Wrapper>
  );
};

export default Layout;
