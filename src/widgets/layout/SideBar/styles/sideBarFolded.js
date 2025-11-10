import { Image } from "@/styles/Image";
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  border-right: 1px solid #d9dce0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
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

export const DevitLogo = styled(Image)`
  height: 32px;
`;

export const Navigation = styled.div`
  width: 100%;
  height: 82vh;
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
  align-items: center;
`;

export const MenuItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  border-radius: 8px;
  background-color: ${(props) => (props.selected ? "#f8f9fa" : "white")};
  width: 100%;
  height: 48px;

  &:hover {
    background-color: #f8f9fa;
  }
`;

export const MenuIcon = styled(Image)`
  width: 20px;
`;

export const NavigationTop = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

export const NavigationBottom = styled.div`
  width: 86%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const MoreBox = styled.div`
  position: absolute;
  bottom: 60px;
  left: 28px;
  width: 160px;
  background-color: #fff;
  border: 1px solid #d3d3d3;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
`;

export const MoreItem = styled.div`
  padding: 14px 18px;
  font-size: 16px;
  color: black;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #f8f9fa;
  }
`;
