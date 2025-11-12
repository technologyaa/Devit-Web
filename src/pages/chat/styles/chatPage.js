import { Image } from "@/styles/Image";
import styled from "styled-components";

/* 전체 컨테이너 */
export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  background-color: #f8f8f8;
`;

/* 왼쪽: 채팅 리스트 */
export const ChatList = styled.div`
  min-width: 280px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ddd;
  background-color: #fff;
`;

/* 오른쪽: 채팅방 */
export const ChatRoom = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
`;

/* 상단 헤더 (채팅 제목 + 아이콘) */
export const ChatListHeader = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  font-weight: 600;
  gap: 10px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fefefe;
`;

export const ChatIcon = styled(Image)`
  width: 28px;
  height: 28px;
`;

/* 채팅 리스트 영역 */
export const ChatItemList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

/* 개별 채팅 항목 */
export const ChatItem = styled.div`
  width: 100%;
  height: 68px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #ececec;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;

  background-color: ${(props) => (props.isActive ? "#f3f3f3" : "transparent")};

  &:hover {
    background-color: #f5f5f5;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const ChatProfile = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e5e5e5;
`;

export const ChatInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 12px;
  gap: 4px;
  flex: 1;
`;

export const ChatUserName = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: #1e1e1e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ChatLastMessage = styled.div`
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
`;

/* 오른쪽 채팅방 헤더 */
export const ChatRoomHeader = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
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

/* 메시지 리스트 */
export const MessageList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
  gap: 12px;
  overflow-y: auto;
  scroll-behavior: smooth;
  background-color: #fafafa;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #d1d1d1;
    border-radius: 4px;
  }
`;

/* 메시지 한 줄 */
export const MessageRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: ${(props) => (props.isMine ? "flex-end" : "flex-start")};
  gap: 6px;
  margin-bottom: ${(props) => (props.isLastOfGroup ? "14px" : "4px")};
`;

export const ProfileWrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: flex-end;
`;

export const MessageProfile = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
`;

/* 메시지 말풍선 */
export const MessageBubble = styled.div`
  max-width: 60%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.4;
  border: ${(props) => (props.isMine ? "none" : "1px solid #ececec")};
  background-color: ${(props) => (props.isMine ? "#883cbe" : "#ffffff")};
  color: ${(props) => (props.isMine ? "#fff" : "#1e1e1e")};
  white-space: pre-line;
  word-break: break-word;
  box-shadow: ${(props) =>
    props.isMine
      ? "0 1px 2px rgba(136,60,190,0.1)"
      : "0 1px 3px rgba(0,0,0,0.04)"};
`;

/* 입력창 */
export const ChatInputArea = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.04);
`;

export const ChatInput = styled.input`
  flex: 1;
  height: 44px;
  border-radius: 22px;
  border: 1px solid #ccc;
  padding: 0 16px;
  font-size: 14px;
  outline: none;
  background-color: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #883cbe;
    box-shadow: 0 0 0 2px rgba(136, 60, 190, 0.15);
  }
`;

export const SendButton = styled.button`
  margin-left: 12px;
  padding: 10px 18px;
  background-color: #883cbe;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    background-color: #7c32b2;
  }

  &:active {
    transform: scale(0.97);
  }
`;

export const EmptyMessage = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  font-size: 16px;
`;
