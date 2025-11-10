import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: 0 !important;
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
  height: 50px;
`;

export const ChatItemList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const ChatItem = styled.div`
  width: 100%;
  height: 20px;
  border: 1px solid #d9dce0;
`;
