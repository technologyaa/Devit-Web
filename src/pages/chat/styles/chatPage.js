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
  width: 320px;
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
  background-color: #fafafa;
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
  height: 72px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #d9dce0;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #f8f9fa;
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
  flex: 1;
`;

export const ChatUserName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #1e1e1e;
`;

export const ChatLastMessage = styled.div`
  font-size: 13px;
  color: #777;
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* ----------------------------- */
/* 🗨️ 오른쪽 ChatRoom 내부 스타일 */
/* ----------------------------- */

/* 상단 사용자 정보 영역 */
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
  font-size: 16px;
  color: #1e1e1e;
`;

/* 개별 메시지 행 */
export const MessageRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: ${(props) => (props.isMine ? "flex-end" : "flex-start")};
`;

/* 메시지 말풍선 */
export const MessageBubble = styled.div`
  max-width: 60%;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.4;
  background-color: ${(props) => (props.isMine ? "#7b5cff" : "#ffffff")};
  color: ${(props) => (props.isMine ? "#fff" : "#333")};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  white-space: pre-line;
`;

/* 하단 메시지 입력창 */
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
    border-color: #7b5cff;
  }
`;

export const SendButton = styled.button`
  margin-left: 12px;
  padding: 8px 16px;
  background-color: #7b5cff;
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
  overflow-y: auto; /* ✅ 스크롤 가능 */
  scroll-behavior: smooth; /* ✅ 부드러운 이동 */
`;

export const EmptyMessage = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  font-size: 16px;
`;
