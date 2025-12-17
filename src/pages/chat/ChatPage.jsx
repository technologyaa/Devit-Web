import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import * as S from "./styles/chatPage";
import { Helmet } from "react-helmet";
import { chatList as initialChatList } from "@/data/chat-list";
import { API_URL } from "@/constants/api";
import axios from "axios";
import Cookies from "js-cookie";
import { Alarm } from "@/toasts/Alarm";

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const roomIdParam = searchParams.get("roomId");
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isSending = useRef(false);
  const messageListRef = useRef(null);

  // 채팅방 목록 조회
  const fetchChatRooms = async () => {
    try {
      const token = Cookies.get("accessToken");
      const headers = {
        "Accept": "application/json"
      };
      
      if (token && token !== "logged-in") {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await axios.get(`${API_URL}/chat/rooms/my-rooms`, {
        headers: headers,
        withCredentials: true
      });

      // 스웨거 응답: { "status": 0, "data": [...] }
      const rooms = response.data?.data || response.data || [];
      
      // API 응답을 UI 형식으로 변환
      const formattedRooms = rooms.map((room) => ({
        id: room.id,
        userName: room.name || "채팅방",
        userProfile: "/assets/dummy-profile.svg",
        lastMessage: "",
        messages: [] // 메시지는 별도로 로드
      }));

      setChatList(formattedRooms);
      
      // roomId 파라미터가 있으면 해당 채팅방 선택, 없으면 첫 번째 채팅방 선택
      if (formattedRooms.length > 0 && !selectedChat) {
        let roomToSelect = null;
        if (roomIdParam) {
          // URL 파라미터로 전달된 roomId 찾기
          roomToSelect = formattedRooms.find(room => 
            String(room.id) === String(roomIdParam)
          );
        }
        // roomId로 찾지 못했거나 roomId가 없으면 첫 번째 채팅방 선택
        if (!roomToSelect) {
          roomToSelect = formattedRooms[0];
        }
        setSelectedChat(roomToSelect);
        fetchMessages(roomToSelect.id);
      }
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
      if (error.response) {
        console.error("Server Error Data:", error.response.data);
        console.error("Server Error Status:", error.response.status);
      }
      // 에러 시 기본값 사용
      setChatList(initialChatList);
      if (initialChatList.length > 0) {
        setSelectedChat(initialChatList[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 메시지 조회
  const fetchMessages = async (roomId) => {
    if (!roomId) return;
    
    try {
      const token = Cookies.get("accessToken");
      const headers = {
        "Accept": "application/json"
      };
      
      if (token && token !== "logged-in") {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await axios.get(`${API_URL}/chat/messages/room/${roomId}`, {
        headers: headers,
        params: {
          page: 0,
          size: 50
        },
        withCredentials: true
      });

      // 스웨거 응답: { "status": 0, "data": [...] }
      const messageData = response.data?.data || response.data || [];
      
      // API 응답을 UI 형식으로 변환
      const formattedMessages = messageData.map((msg) => {
        const currentUser = Cookies.get("accessToken"); // 실제로는 현재 사용자 ID 필요
        return {
          id: msg.id,
          sender: msg.sender,
          content: msg.content,
          time: msg.timestamp,
          isMine: msg.sender === currentUser || msg.type === "ENTER" // 임시 로직
        };
      });

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      if (error.response) {
        console.error("Server Error Data:", error.response.data);
        console.error("Server Error Status:", error.response.status);
      }
      setMessages([]);
    }
  };

  // 컴포넌트 마운트 시 채팅방 목록 조회
  useEffect(() => {
    fetchChatRooms();
  }, []);

  // 선택된 채팅방 변경 시 메시지 조회
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat]);

  // 🔗 링크 자동 감지 함수
  const renderMessageWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <S.LinkText
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
          >
            {part}
          </S.LinkText>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // 메시지 전송 (스웨거에 메시지 전송 API가 없으므로 로컬 상태만 업데이트)
  const handleSend = () => {
    if (isSending.current || isComposing) return;
    if (!messageInput.trim() || !selectedChat) return;

    isSending.current = true;
    const newMessage = {
      id: messages.length + 1,
      sender: "나",
      content: messageInput,
      time: new Date().toISOString(),
      isMine: true,
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");

    setTimeout(() => {
      isSending.current = false;
    }, 100);
  };

  // 메시지 추가 시 자동 스크롤
  useEffect(() => {
    const el = messageListRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="./assets/Helmet.svg" />
      </Helmet>

      <S.Container>
        {/* 💬 왼쪽 채팅 리스트 */}
        <S.ChatList>
          <S.ChatListHeader>
            <S.ChatIcon src="/assets/chat-icon.svg" alt="chat" />
            채팅
          </S.ChatListHeader>

          <S.ChatItemList>
            {isLoading ? (
              <div style={{ padding: "20px", textAlign: "center" }}>로딩 중...</div>
            ) : chatList.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center" }}>채팅방이 없습니다.</div>
            ) : (
              chatList.map((chat) => (
                <S.ChatItem
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  isActive={selectedChat?.id === chat.id}
                >
                  <S.ChatProfile
                    src={chat.userProfile || "/assets/default-profile.svg"}
                    alt={chat.userName}
                  />
                  <S.ChatInfo>
                    <S.ChatUserName>{chat.userName}</S.ChatUserName>
                    <S.ChatLastMessage>
                      {chat.lastMessage || "메시지가 없습니다."}
                    </S.ChatLastMessage>
                  </S.ChatInfo>
                </S.ChatItem>
              ))
            )}
          </S.ChatItemList>
        </S.ChatList>

        {/* 💭 오른쪽 채팅방 */}
        <S.ChatRoom>
          {selectedChat ? (
            <>
              <S.ChatRoomHeader>
                <S.ChatRoomProfile
                  src={selectedChat.userProfile}
                  alt={selectedChat.userName}
                />
                <S.ChatRoomUserName>{selectedChat.userName}</S.ChatRoomUserName>
              </S.ChatRoomHeader>

              <S.MessageList ref={messageListRef}>
                {messages.length === 0 ? (
                  <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
                    메시지가 없습니다.
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMine = msg.isMine;
                    const nextMsg = messages[index + 1];
                    const isLastOfGroup =
                      !nextMsg || nextMsg.isMine !== msg.isMine;

                    return (
                      <S.MessageRow
                        key={msg.id}
                        isMine={isMine}
                        isLastOfGroup={isLastOfGroup}
                      >
                        {!isMine && isLastOfGroup && (
                          <S.ProfileWrapper>
                            <S.MessageProfile
                              src={
                                selectedChat.userProfile ||
                                "/assets/default-profile.svg"
                              }
                              alt={selectedChat.userName}
                            />
                          </S.ProfileWrapper>
                        )}

                        <S.MessageBubble isMine={isMine}>
                          {renderMessageWithLinks(msg.content)}
                        </S.MessageBubble>
                      </S.MessageRow>
                    );
                  })
                )}
              </S.MessageList>

              <S.ChatInputArea
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              >
                <S.ChatInput
                  type="text"
                  placeholder="메시지를 입력하세요..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={(e) => {
                    setIsComposing(false);
                    setMessageInput(e.target.value);
                  }}
                />
                <S.SendButton onClick={handleSend}>전송</S.SendButton>
              </S.ChatInputArea>
            </>
          ) : (
            <S.EmptyMessage>채팅방을 선택해주세요 💬</S.EmptyMessage>
          )}
        </S.ChatRoom>
      </S.Container>
    </>
  );
}
