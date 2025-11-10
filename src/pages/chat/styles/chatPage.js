import { Image } from "@/styles/Image";
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

export const ChatList = styled.div`
  width: 320px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ccc;
`;

export const ChatRoom = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #d9dce0;
`;

export const ChatListHeader = styled.div`
  width: 100%;
  height: 130px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 500;
  gap: 8px;
  border-bottom: 1px solid #d9dce0;
`;

export const ChatItemList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const ChatItem = styled.div`
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #d9dce0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #f8f9fa;
  }
`;

export const ChatIcon = styled(Image)`
  width: 32px;
`;
