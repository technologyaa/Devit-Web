import { Image } from "@/styles/Image";
import styled from "styled-components";

/* 전체 컨테이너 */
export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

/* 왼쪽: 채팅 리스트 */
export const ChatList = styled.div`
  min-width: 280px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ccc;
  background-color: #fff;
`;

/* 오른쪽: 채팅방 영역 */
export const ChatRoom = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8ff;
`;

/* 상단 헤더 (채팅 제목 + 아이콘) */
export const ChatListHeader = styled.div`
  width: 100%;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 500;
  gap: 8px;
  border-bottom: 1px solid #d9dce0;
`;

export const ChatIcon = styled(Image)`
  width: 32px;
`;

/* 채팅 리스트 전체 */
export const ChatItemList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

/* 채팅 목록 하나 */
export const ChatItem = styled.div`
  width: 100%;
  height: 68px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #d9dce0;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.isActive ? "#f8f9fa" : "transparent")};

  &:hover {
    background-color: ${(props) => (props.isActive ? "#f8f9fa" : "#f8f9fa")};
  }
`;

export const ChatProfile = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
`;

export const ChatInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 12px;
  gap: 6px;
  flex: 1;
`;

/* ----------------------------- */
/* 🗨️ 오른쪽 ChatRoom 내부 스타일 */
/* ----------------------------- */

export const ChatRoomHeader = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid #d9dce0;
  background-color: #fff;
`;

export const ChatRoomProfile = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
`;

export const ChatRoomUserName = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: #1e1e1e;
`;

export const MessageRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: ${(props) => (props.isMine ? "flex-end" : "flex-start")};
  gap: 6px;
  margin-bottom: 4px;
  ${(props) =>
    !props.isMine &&
    props.isLastOfGroup &&
    `
      margin-bottom: 10px;
    `}
`;

export const MessageProfile = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 2px;
`;

export const MessageBubble = styled.div`
  max-width: 60%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
  border: ${(props) => (props.isMine ? "none" : "1px solid #f1f1f1ff")};
  background-color: ${(props) => (props.isMine ? "#883cbe" : "#ffffff")};
  color: ${(props) => (props.isMine ? "#fff" : "black")};
  white-space: pre-line;
  word-break: break-word;
`;

/* 🔗 메시지 내 링크 스타일 */
export const LinkText = styled.a`
  color: ${(props) => (props.isMine ? "#d4bfff" : "white")};
  text-decoration: underline;
  word-break: break-all;
  &:hover {
    text-decoration: none;
  }
`;

export const ChatInputArea = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  background-color: #fff;
  border-top: 1px solid #d9dce0;
`;

export const ChatInput = styled.input`
  flex: 1;
  height: 44px;
  border-radius: 22px;
  border: 1px solid #ccc;
  padding: 0 16px;
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: #883cbe;
  }
`;

export const SendButton = styled.button`
  margin-left: 12px;
  padding: 10px 18px;
  background-color: #883cbe;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #6a4be8;
  }
`;

export const MessageList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 12px;
  overflow-y: auto;
  scroll-behavior: smooth;
`;

export const EmptyMessage = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  font-size: 16px;
`;

export const ProfileWrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: flex-end;
`;

export const ChatUserName = styled.div`
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
`;

export const ChatLastMessage = styled.div`
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
`;
