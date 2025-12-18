import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import * as S from "./styles/chatPage";
import { Helmet } from "react-helmet";
import { chatList as initialChatList } from "@/data/chat-list";
import { API_URL, WS_URL, getImageUrl } from "@/constants/api";
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
  const wsRef = useRef(null); // WebSocket 연결 참조
  const currentUserIdRef = useRef(null); // 현재 사용자 ID

  // 채팅방 목록 조회
  const fetchChatRooms = async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get("accessToken");
      const headers = {
        "Accept": "application/json"
      };
      
      if (token && token !== "logged-in") {
        headers["Authorization"] = `Bearer ${token}`;
      }

      console.log("Fetching chat rooms from:", `${API_URL}/chat/rooms/my-rooms`);
      const response = await axios.get(`${API_URL}/chat/rooms/my-rooms`, {
        headers: headers,
        withCredentials: true
      });

      console.log("Chat rooms API response:", response);
      console.log("Response data:", response.data);

      // 스웨거 응답: { "status": 0, "data": [...] } 또는 배열
      let rooms = [];
      if (Array.isArray(response.data)) {
        rooms = response.data;
      } else if (response.data?.data) {
        rooms = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (response.data?.rooms) {
        rooms = Array.isArray(response.data.rooms) ? response.data.rooms : [];
      }
      
      console.log("Parsed rooms:", rooms);
      console.log("Rooms count:", rooms.length);
      
      // API 응답을 UI 형식으로 변환
      const formattedRooms = rooms.map((room) => ({
        id: room.id || room.roomId,
        userName: room.name || room.roomName || room.partnerName || "채팅방",
        userProfile: getImageUrl(room.profileImage || room.profile || room.profileImageUrl),
        lastMessage: room.lastMessage || room.lastMessageContent || "",
        messages: [] // 메시지는 별도로 로드
      }));

      console.log("Formatted rooms:", formattedRooms);
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
      } else if (formattedRooms.length === 0) {
        console.log("No chat rooms found");
        setChatList([]);
      }
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
      if (error.response) {
        console.error("Server Error Data:", error.response.data);
        console.error("Server Error Status:", error.response.status);
        if (error.response.status === 401) {
          Alarm("❌", "로그인이 필요합니다.", "#FF1E1E", "#FFEAEA");
        } else if (error.response.status === 404) {
          console.log("No chat rooms endpoint or no rooms found");
          setChatList([]);
        }
      } else if (!error.response) {
        console.error("Network error or CORS issue");
      }
      // 에러 시 빈 배열로 설정 (기본값 사용하지 않음)
      setChatList([]);
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
        const senderId = msg.senderId || msg.memberId;
        const isMine = senderId === currentUserIdRef.current || 
                       msg.senderId === currentUserIdRef.current;
        
        return {
          id: msg.id,
          sender: msg.senderName || msg.sender || "알 수 없음",
          content: msg.content || msg.message || "",
          time: msg.timestamp || msg.createdAt || new Date().toISOString(),
          isMine: isMine
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

  // 현재 사용자 ID 가져오기
  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token || token === "logged-in") return;

        const headers = {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        };

        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: headers,
          withCredentials: true
        });
        const meData = response.data?.data || response.data || {};
        currentUserIdRef.current = meData.id || meData.memberId;
        console.log("Current user ID loaded:", currentUserIdRef.current);
      } catch (error) {
        console.warn("Failed to get current user ID:", error);
      }
    };

    getCurrentUserId();
    fetchChatRooms();
  }, []);

  // 선택된 채팅방 변경 시 메시지 조회 및 WebSocket 연결
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
      // WebSocket 연결
      connectWebSocket(selectedChat.id);
    }

    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      disconnectWebSocket();
    };
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

  // WebSocket 연결
  const connectWebSocket = (roomId) => {
    if (!roomId) return;
    
    // 기존 연결이 있으면 닫기
    if (wsRef.current) {
      wsRef.current.close();
    }

    const token = Cookies.get("accessToken");
    if (!token || token === "logged-in") {
      console.warn("No valid token for WebSocket connection");
      return;
    }

    // WebSocket URL 구성: ws://domain/chat/room/{roomId}?token={token}
    const wsUrl = `${WS_URL}/chat/room/${roomId}?token=${encodeURIComponent(token)}`;
    console.log("Connecting to WebSocket:", wsUrl);

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected to room:", roomId);
        Alarm("✅", "실시간 채팅이 연결되었습니다.", "#3CAF50", "#E8F5E9");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket message received:", data);
          
          // 메시지 타입에 따라 처리
          if (data.type === "MESSAGE" || data.type === "CHAT") {
            const newMessage = {
              id: data.messageId || data.id || Date.now(),
              sender: data.senderName || data.sender || "알 수 없음",
              content: data.content || data.message || "",
              time: data.timestamp || data.createdAt || new Date().toISOString(),
              isMine: data.senderId === currentUserIdRef.current || data.isMine || false
            };

            setMessages((prevMessages) => {
              // 중복 메시지 체크
              const exists = prevMessages.some(msg => msg.id === newMessage.id);
              if (exists) return prevMessages;
              return [...prevMessages, newMessage];
            });

            // 채팅방 목록의 마지막 메시지 업데이트
            setChatList((prevList) => 
              prevList.map((chat) => 
                chat.id === roomId
                  ? { ...chat, lastMessage: newMessage.content }
                  : chat
              )
            );
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        Alarm("⚠️", "채팅 연결에 문제가 발생했습니다.", "#FF9800", "#FFF3E0");
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        // 자동 재연결 로직 (선택사항)
        // setTimeout(() => connectWebSocket(roomId), 3000);
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      Alarm("❌", "채팅 연결에 실패했습니다.", "#FF1E1E", "#FFEAEA");
    }
  };

  // WebSocket 연결 해제
  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  // 메시지 전송 (WebSocket 사용)
  const handleSend = () => {
    if (isSending.current || isComposing) return;
    if (!messageInput.trim() || !selectedChat) return;

    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      Alarm("⚠️", "채팅 연결이 되어있지 않습니다.", "#FF9800", "#FFF3E0");
      return;
    }

    isSending.current = true;

    // WebSocket으로 메시지 전송
    const messagePayload = {
      type: "CHAT",
      roomId: selectedChat.id,
      content: messageInput.trim()
    };

    try {
      ws.send(JSON.stringify(messagePayload));
      console.log("Message sent via WebSocket:", messagePayload);
      setMessageInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
      Alarm("❌", "메시지 전송에 실패했습니다.", "#FF1E1E", "#FFEAEA");
    }

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
                    src={getImageUrl(chat.userProfile) || "/assets/default-profile.svg"}
                    alt={chat.userName}
                    onError={(e) => {
                      e.target.src = "/assets/default-profile.svg";
                    }}
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
                  src={getImageUrl(selectedChat.userProfile)}
                  alt={selectedChat.userName}
                  onError={(e) => {
                    e.target.src = "/assets/default-profile.svg";
                  }}
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
                              src={getImageUrl(selectedChat.userProfile) || "/assets/default-profile.svg"}
                              alt={selectedChat.userName}
                              onError={(e) => {
                                e.target.src = "/assets/default-profile.svg";
                              }}
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
