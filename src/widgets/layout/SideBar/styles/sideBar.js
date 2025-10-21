import { Image } from "@/styles/Image";
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  border-right: 1px solid #d9dce0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Top = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const LogoBox = styled.div`
  width: 100%;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Navigation = styled.div`
  width: 100%;
  height: 670px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const NavigationWrapper = styled.div`
  width: 86%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  border-radius: 8px;
  background-color: ${(props) => (props.selected ? "#f8f9fa" : "white")};
  width: 100%;

  &:hover {
    background-color: #f8f9fa;
  }
`;

export const MenuIcon = styled(Image)`
  width: 20px;
`;

export const SettingIcon = styled(Image)`
  width: 20px;
`;

export const MenuText = styled.div`
  font-size: 18px;
  font-weight: 500;
`;

export const DevitLogo = styled(Image)`
  height: 40px;
`;

export const NavigationTop = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const NavigationBottom = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
