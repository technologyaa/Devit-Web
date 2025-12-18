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
  const currentUsernameRef = useRef(null); // 현재 사용자 username (WebSocket용)
  const currentRoomIdRef = useRef(null); // 현재 선택된 채팅방 ID
  const pendingMessagesRef = useRef(new Set()); // 전송 대기 중인 메시지 추적 (content 기반)

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
      const formattedRooms = rooms.map((room) => {
        // 상대방 정보 찾기 (PRIVATE 채팅방인 경우)
        let partnerUsername = null;
        let partnerName = room.name || room.roomName || room.partnerName || "채팅방";
        
        // 방법 1: members 배열에서 찾기
        if (room.members && Array.isArray(room.members)) {
          // 현재 사용자가 아닌 멤버 찾기
          const partner = room.members.find(m => 
            (m.id || m.memberId) !== currentUserIdRef.current &&
            (m.username || m.name || m.id)
          );
          if (partner) {
            partnerUsername = partner.username || partner.name || String(partner.id || partner.memberId);
            partnerName = partner.username || partner.name || partnerName;
          }
        }
        
        // 방법 2: memberIds만 있는 경우, 채팅방 이름에서 상대방 이름 추출
        if (!partnerUsername && (room.memberIds && Array.isArray(room.memberIds)) && room.name) {
          const nameParts = room.name.split(' & ');
          const currentUsername = currentUsernameRef.current || '';
          
          // 현재 사용자 이름이 포함되어 있으면 제거
          const otherPartners = nameParts.filter(part => 
            part.toLowerCase() !== currentUsername.toLowerCase() && 
            part.trim() !== ''
          );
          
          if (otherPartners.length > 0) {
            partnerUsername = otherPartners[0].trim();
            partnerName = room.name; // 채팅방 이름 전체 사용
          }
        }
        
        return {
          id: room.id || room.roomId,
          userName: partnerName,
          userProfile: getImageUrl(room.profileImage || room.profile || room.profileImageUrl),
          lastMessage: room.lastMessage || room.lastMessageContent || "",
          partnerUsername: partnerUsername, // WebSocket 메시지 전송용
        messages: [] // 메시지는 별도로 로드
        };
      });

      console.log("Formatted rooms:", formattedRooms);
      setChatList(formattedRooms);
      
      // roomId 파라미터가 있으면 해당 채팅방 선택, 없으면 첫 번째 채팅방 선택
      // 새로고침 시에도 항상 채팅방 선택 및 메시지 로드
      if (formattedRooms.length > 0) {
        let roomToSelect = null;
        if (roomIdParam) {
          // URL 파라미터로 전달된 roomId 찾기
          roomToSelect = formattedRooms.find(room => 
            String(room.id) === String(roomIdParam)
          );
          console.log("🔍 Looking for roomId from URL:", roomIdParam, "Found:", roomToSelect);
        }
        // roomId로 찾지 못했거나 roomId가 없으면 첫 번째 채팅방 선택
        if (!roomToSelect) {
          roomToSelect = formattedRooms[0];
          console.log("🔍 No roomId in URL or not found, selecting first room:", roomToSelect.id);
        }
        
        // 새로고침 시 selectedChat이 null이거나 다른 채팅방이면 업데이트
        if (!selectedChat || selectedChat.id !== roomToSelect.id) {
          console.log("✅ Selecting chat room:", roomToSelect.id);
          console.log("✅ Current selectedChat:", selectedChat);
          setSelectedChat(roomToSelect);
          // 메시지는 useEffect에서 자동으로 로드됨
        } else {
          // 같은 채팅방이면 메시지만 다시 로드 (새로고침 시)
          console.log("🔄 Reloading messages for existing chat room:", roomToSelect.id);
          fetchMessages(roomToSelect.id);
        }
      } else if (formattedRooms.length === 0) {
        console.log("⚠️ No chat rooms found");
        setChatList([]);
        setSelectedChat(null);
        setMessages([]);
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
    if (!roomId) {
      console.warn("⚠️ fetchMessages called with no roomId");
      return;
    }
    
    console.log("📥 ========== Fetching messages ==========");
    console.log("📥 RoomId:", roomId);
    console.log("📥 Current userId:", currentUserIdRef.current);
    console.log("📥 API URL:", `${API_URL}/chat/messages/room/${roomId}`);
    
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

      console.log("📥 Full API response:", response);
      console.log("📥 Response status:", response.status);
      console.log("📥 Response data:", response.data);
      
      // 가이드에 따른 응답 형식: { success: true, data: [...] }
      let messageData = [];
      if (response.data?.success && Array.isArray(response.data.data)) {
        // 표준 응답 형식: { success: true, data: [...] }
        messageData = response.data.data;
        console.log("📥 Using standard response format (success: true, data: [...])");
      } else if (Array.isArray(response.data)) {
        // 직접 배열로 반환되는 경우
        messageData = response.data;
        console.log("📥 Using direct array response format");
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // { data: [...] } 형식 (success 필드 없음)
        messageData = response.data.data;
        console.log("📥 Using data-only response format");
      } else if (response.data?.content && Array.isArray(response.data.content)) {
        // 페이지네이션 응답: { content: [...], totalElements: ... }
        messageData = response.data.content;
        console.log("📥 Using pagination response format");
      } else if (response.data?.messages && Array.isArray(response.data.messages)) {
        messageData = response.data.messages;
        console.log("📥 Using messages field format");
      } else {
        messageData = [];
        console.warn("⚠️ Unknown response format, setting empty array");
      }
      
      console.log("📥 Parsed message data:", messageData);
      console.log("📥 Message count:", messageData.length);
      
      if (messageData.length > 0) {
        console.log("📥 First message:", messageData[0]);
        console.log("📥 Last message:", messageData[messageData.length - 1]);
        console.log("📥 First message roomId:", messageData[0].roomId);
      }
      
      // API 응답을 UI 형식으로 변환
      const formattedMessages = messageData.map((msg, index) => {
        // sender는 username 문자열
        const senderName = msg.sender || msg.senderName || msg.sender?.username || msg.sender?.name || "알 수 없음";
        
        // 현재 사용자와 비교 (username 기반)
        const isMine = senderName === currentUsernameRef.current || 
                       String(msg.senderId) === String(currentUserIdRef.current) ||
                       String(msg.memberId) === String(currentUserIdRef.current);
        
        const formatted = {
          id: msg.id || msg.messageId || `msg-${index}`,
          sender: senderName,
          content: msg.content || msg.message || "",
          time: msg.timestamp || msg.createdAt || msg.sentAt || new Date().toISOString(),
          isMine: isMine,
          roomId: msg.roomId || roomId,
          type: msg.type || "TALK"
        };
        
        if (index === 0) {
          console.log("📥 Sample formatted message:", formatted);
        }
        
        return formatted;
      });

      console.log("📥 Formatted messages count:", formattedMessages.length);
      console.log("📥 Setting messages to state...");
      setMessages(formattedMessages);
      console.log("📥 ✅ Messages loaded successfully");
      
      if (formattedMessages.length === 0) {
        console.log("ℹ️ No messages found for this room (empty array returned)");
      }
    } catch (error) {
      console.error("❌ ========== Failed to fetch messages ==========");
      console.error("❌ Error:", error);
      if (error.response) {
        console.error("❌ Response status:", error.response.status);
        console.error("❌ Response data:", error.response.data);
        
        // 가이드에 따른 에러 처리
        if (error.response.status === 404) {
          console.log("⚠️ 채팅방을 찾을 수 없습니다 (404)");
          Alarm("⚠️", "채팅방을 찾을 수 없습니다.", "#FF9800", "#FFF3E0");
        } else if (error.response.status === 403) {
          console.log("⚠️ 채팅방 멤버가 아닙니다 (403)");
          Alarm("⚠️", "채팅방 멤버가 아닙니다.", "#FF9800", "#FFF3E0");
        } else if (error.response.status === 401) {
          console.log("⚠️ 인증되지 않았습니다 (401)");
          Alarm("⚠️", "인증이 필요합니다. 다시 로그인해주세요.", "#FF1E1E", "#FFEAEA");
        } else if (error.response.status === 500) {
          console.log("⚠️ 서버 오류 (500)");
          Alarm("❌", "서버 오류가 발생했습니다.", "#FF1E1E", "#FFEAEA");
        }
      } else if (error.request) {
        console.error("❌ No response received:", error.request);
        Alarm("❌", "서버에 연결할 수 없습니다.", "#FF1E1E", "#FFEAEA");
      } else {
        console.error("❌ Error setting up request:", error.message);
        Alarm("❌", `메시지 조회 오류: ${error.message}`, "#FF1E1E", "#FFEAEA");
      }
      // 에러 시에도 빈 배열로 설정하여 UI가 깨지지 않도록
      setMessages([]);
    }
  };

  // 채팅방 상세 정보 가져오기 (상대방 정보 포함)
  const fetchRoomDetail = async (roomId) => {
    if (!roomId) return null;
    
    try {
      const token = Cookies.get("accessToken");
      const headers = {
        "Accept": "application/json"
      };
      
      if (token && token !== "logged-in") {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await axios.get(`${API_URL}/chat/rooms/${roomId}`, {
        headers,
        withCredentials: true
      });
      
      const roomData = response.data?.data || response.data || {};
      console.log("📋 Room detail fetched:", roomData);
      return roomData;
    } catch (error) {
      console.error("Failed to fetch room detail:", error);
      return null;
    }
  };

  // 채팅방의 상대방 정보 업데이트
  const updatePartnerInfo = async (chat) => {
    if (!chat || !chat.id) return chat;
    
    // 이미 partnerUsername이 있으면 업데이트 불필요
    if (chat.partnerUsername) {
      return chat;
    }

    console.log("🔍 Updating partner info for room:", chat.id);
    const roomData = await fetchRoomDetail(chat.id);
    
    if (!roomData) {
      console.warn("⚠️ Room data not found");
      return chat;
    }
    
    // 방법 1: members 배열에서 찾기
    if (roomData.members && Array.isArray(roomData.members)) {
      const partner = roomData.members.find(m => 
        (m.id || m.memberId) !== currentUserIdRef.current &&
        (m.username || m.name || m.id)
      );
      
      if (partner) {
        const partnerUsername = partner.username || partner.name || String(partner.id || partner.memberId);
        const partnerName = partner.username || partner.name || chat.userName || "채팅방";
        
        console.log("✅ Partner info updated from members:", { partnerUsername, partnerName });
        
        return {
          ...chat,
          partnerUsername,
          userName: partnerName,
          userProfile: getImageUrl(partner.profileImage || partner.profile || roomData.profileImage || chat.userProfile)
        };
      }
    }
    
    // 방법 2: memberIds만 있는 경우, 상대방 ID 찾기
    if (roomData.memberIds && Array.isArray(roomData.memberIds) && roomData.memberIds.length > 0) {
      const partnerId = roomData.memberIds.find(id => 
        String(id) !== String(currentUserIdRef.current)
      );
      
      if (partnerId) {
        console.log("🔍 Found partnerId from memberIds:", partnerId);
        
        // 채팅방 이름에서 상대방 이름 추출 (예: "hun & jdksla0129" -> "jdksla0129")
        let partnerUsername = null;
        if (roomData.name && typeof roomData.name === 'string') {
          const nameParts = roomData.name.split(' & ');
          const currentUsername = currentUsernameRef.current || '';
          
          // 현재 사용자 이름이 포함되어 있으면 제거
          const otherPartners = nameParts.filter(part => 
            part.toLowerCase() !== currentUsername.toLowerCase() && 
            part.trim() !== ''
          );
          
          if (otherPartners.length > 0) {
            partnerUsername = otherPartners[0].trim();
            console.log("✅ Partner username extracted from room name:", partnerUsername);
          }
        }
        
        // 이름에서 추출하지 못했으면 ID를 username으로 사용
        if (!partnerUsername) {
          partnerUsername = String(partnerId);
        }
        
        const partnerName = chat.userName || roomData.name || "채팅방";
        
        console.log("✅ Partner info updated from memberIds:", { partnerUsername, partnerName, partnerId });
        
        return {
          ...chat,
          partnerUsername,
          userName: partnerName,
          userProfile: chat.userProfile || getImageUrl(roomData.profileImage)
        };
      }
    }
    
    // 방법 3: 채팅방 이름에서 상대방 이름 추출 시도
    if (roomData.name && typeof roomData.name === 'string') {
      const nameParts = roomData.name.split(' & ');
      const currentUsername = currentUsernameRef.current || '';
      
      const otherPartners = nameParts.filter(part => 
        part.toLowerCase() !== currentUsername.toLowerCase() && 
        part.trim() !== ''
      );
      
      if (otherPartners.length > 0) {
        const partnerUsername = otherPartners[0].trim();
        console.log("✅ Partner username extracted from room name only:", partnerUsername);
        
        return {
          ...chat,
          partnerUsername,
          userName: chat.userName || roomData.name || "채팅방"
        };
      }
    }
    
    console.warn("⚠️ Could not find partner info from room data");
    return chat;
  };

  // 현재 사용자 정보 가져오기 (ID 및 username)
  useEffect(() => {
    const getCurrentUser = async () => {
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
        // username 필드 확인 (다양한 필드명 시도)
        currentUsernameRef.current = meData.username || meData.name || meData.id || String(meData.memberId || meData.id || "");
        console.log("Current user ID loaded:", currentUserIdRef.current);
        console.log("Current username loaded:", currentUsernameRef.current);
        
        // 사용자 정보 로드 후 채팅방 목록 가져오기
        await fetchChatRooms();
      } catch (error) {
        console.warn("Failed to get current user info:", error);
        // 사용자 정보 가져오기 실패해도 채팅방 목록은 가져오기
        await fetchChatRooms();
      }
    };

    getCurrentUser();
  }, []);

  // 선택된 채팅방 변경 시 메시지 조회 및 WebSocket 연결
  useEffect(() => {
    if (selectedChat && selectedChat.id) {
      console.log("Selected chat changed, loading messages for room:", selectedChat.id);
      currentRoomIdRef.current = selectedChat.id;
      
      // 상대방 정보가 없으면 가져오기
      const loadChatRoomInfo = async () => {
        const updatedChat = await updatePartnerInfo(selectedChat);
        if (updatedChat.partnerUsername !== selectedChat.partnerUsername) {
          console.log("🔄 Updating selectedChat with partner info");
          setSelectedChat(updatedChat);
          
          // 채팅방 목록도 업데이트
          setChatList((prevList) =>
            prevList.map((chat) =>
              chat.id === updatedChat.id ? updatedChat : chat
            )
          );
        }
        
        // 메시지 로드
        fetchMessages(updatedChat.id);
        
        // WebSocket 연결 (username이 준비된 경우에만)
        if (currentUsernameRef.current) {
          connectWebSocket(updatedChat.id);
        } else {
          // username이 아직 로드되지 않은 경우 잠시 대기
          setTimeout(() => {
            if (currentUsernameRef.current && selectedChat) {
              connectWebSocket(updatedChat.id);
            }
          }, 500);
        }
      };
      
      loadChatRoomInfo();
    } else {
      // 채팅방이 선택되지 않았으면 메시지 초기화
      setMessages([]);
      disconnectWebSocket();
    }

    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      // 채팅방 변경 시에만 WebSocket 연결 해제 (언마운트 시에는 유지)
      if (selectedChat) {
        disconnectWebSocket();
      }
    };
  }, [selectedChat?.id]); // selectedChat.id만 의존성으로 사용하여 무한 루프 방지

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


  // WebSocket 연결 (문서에 따르면 /ws/chat?username={username} 형식)
  const connectWebSocket = (roomId) => {
    if (!roomId) return;
    
    // username이 없으면 연결 불가
    if (!currentUsernameRef.current) {
      console.warn("Username not available for WebSocket connection");
      return;
    }
    
    // 기존 연결이 있으면 닫기
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // 문서에 따르면: wss://devit.run/ws/chat?username={사용자명}
    const wsUrl = `${WS_URL}/ws/chat?username=${encodeURIComponent(currentUsernameRef.current)}`;
    console.log("Connecting to WebSocket:", wsUrl);
    console.log("Username:", currentUsernameRef.current);
    console.log("Room ID:", roomId);

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      currentRoomIdRef.current = roomId;

      ws.onopen = () => {
        console.log("✅ WebSocket connected to:", wsUrl);
        Alarm("✅", "실시간 채팅이 연결되었습니다.", "#3CAF50", "#E8F5E9");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📨 WebSocket message received:", data);
          console.log("📨 Raw message data:", event.data);
          console.log("📨 Current roomId:", currentRoomIdRef.current);
          console.log("📨 Message roomId:", data.roomId);
          console.log("📨 Message sender:", data.sender);
          console.log("📨 Message receiver:", data.receiver);
          console.log("📨 Message content:", data.content);
          
          // 에러 메시지 처리
          if (data.error) {
            console.error("❌ WebSocket error message:", data.error);
            console.error("❌ Error details:", data.details);
            Alarm("❌", `메시지 처리 오류: ${data.error}`, "#FF1E1E", "#FFEAEA");
            return;
          }
          
          // 성공 응답 로깅
          if (data.id && data.type === "TALK") {
            console.log("✅ Message successfully saved to DB with ID:", data.id);
          }
          
          // 메시지 타입 확인 및 필터링
          // 백엔드 DTO: sender, receiver, content, type, id, timestamp
          // roomId는 지원하지 않음, receiver만 사용 (1:1 메시지)
          if (data.type === "TALK" || data.type === "MESSAGE" || data.type === "CHAT" || !data.type) {
            // 현재 선택된 채팅방의 상대방 username 확인
            const selectedRoom = chatList.find(chat => chat.id === currentRoomIdRef.current);
            const currentPartnerUsername = selectedChat?.partnerUsername || selectedRoom?.partnerUsername;
            
            // 메시지 필터링 (receiver 기반):
            // 1. sender가 현재 사용자가 아니고, receiver가 현재 사용자인 경우 (나에게 온 메시지)
            // 2. sender가 현재 사용자이고, receiver가 현재 선택된 채팅방의 상대방인 경우 (내가 보낸 메시지)
            // 3. receiver가 현재 채팅방의 상대방이고, sender가 상대방인 경우 (상대방이 보낸 메시지)
            const isForCurrentChat = 
              (data.sender !== currentUsernameRef.current && 
               data.receiver === currentUsernameRef.current) || // 나에게 온 메시지
              (data.sender === currentUsernameRef.current && 
               data.receiver === currentPartnerUsername) || // 내가 보낸 메시지 (상대방에게)
              (data.receiver === currentPartnerUsername && 
               data.sender === currentPartnerUsername && 
               data.sender !== currentUsernameRef.current); // 상대방이 보낸 메시지
            
            console.log("📨 Message filter - Sender:", data.sender, "Receiver:", data.receiver, 
                       "Current user:", currentUsernameRef.current, "Partner:", currentPartnerUsername,
                       "Is for current chat:", isForCurrentChat);
            
            if (isForCurrentChat) {
              console.log("✅ Message matches current chat, adding to UI");
              const isMine = data.sender === currentUsernameRef.current || 
                            data.senderName === currentUsernameRef.current ||
                            data.senderId === currentUserIdRef.current;
              
              // 메시지 내용 추출 (스코프 밖에서 사용하기 위해)
              const messageContent = data.content || data.message || "";

              setMessages((prevMessages) => {
                // 내가 보낸 메시지인 경우, optimistic update로 추가된 임시 메시지 찾아서 교체
                if (isMine) {
                  // 같은 내용의 임시 메시지가 있는지 확인
                  const tempMessageIndex = prevMessages.findIndex(msg => 
                    msg.id?.toString().startsWith('temp-') &&
                    msg.content === messageContent &&
                    msg.isMine === true
                  );

                  if (tempMessageIndex !== -1) {
                    // 임시 메시지를 실제 메시지로 교체
                    console.log("🔄 Replacing temporary message with server response");
                    const newMessage = {
                      id: data.id || Date.now(),
                      sender: data.sender || data.senderName || currentUsernameRef.current || "나",
                      content: messageContent,
                      time: data.timestamp || data.createdAt || new Date().toISOString(),
                      isMine: true,
                      roomId: data.roomId || currentRoomIdRef.current,
                      type: data.type || "TALK"
                    };

                    const updated = [...prevMessages];
                    updated[tempMessageIndex] = newMessage;
                    return updated;
                  }
                }

                // 새 메시지 생성
                const newMessage = {
                  id: data.id || Date.now(),
                  sender: data.sender || data.senderName || "알 수 없음",
                  content: messageContent,
                  time: data.timestamp || data.createdAt || new Date().toISOString(),
                  isMine: isMine,
                  roomId: data.roomId || currentRoomIdRef.current,
                  type: data.type || "TALK"
                };

                // 중복 메시지 체크 (ID, 내용+발신자+시간)
                const exists = prevMessages.some(msg => {
                  // 같은 ID
                  if (msg.id === newMessage.id) return true;
                  // 같은 내용, 같은 발신자, 3초 이내
                  if (msg.content === newMessage.content && 
                      msg.sender === newMessage.sender &&
                      Math.abs(new Date(msg.time) - new Date(newMessage.time)) < 3000) {
                    return true;
                  }
                  return false;
                });

                if (exists) {
                  console.log("⚠️ Duplicate message detected, skipping");
                  return prevMessages;
                }
                
                console.log("✅ Adding new message to UI:", newMessage);
                return [...prevMessages, newMessage];
              });

              // 채팅방 목록의 마지막 메시지 업데이트 (messageContent 사용)
              setChatList((prevList) => 
                prevList.map((chat) => 
                  chat.id === currentRoomIdRef.current
                    ? { ...chat, lastMessage: messageContent }
                    : chat
                )
              );
            } else {
              console.log("⚠️ Message not for current chat, ignoring");
            }
          } else {
            console.log("⚠️ Unknown message type:", data.type);
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
          console.error("Raw message:", event.data);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        console.error("WebSocket readyState:", ws.readyState);
        console.error("WebSocket URL:", wsUrl);
        Alarm("⚠️", "채팅 연결에 문제가 발생했습니다.", "#FF9800", "#FFF3E0");
      };

      ws.onclose = (event) => {
        console.log("WebSocket disconnected");
        console.log("Close code:", event.code);
        console.log("Close reason:", event.reason);
        console.log("Was clean:", event.wasClean);
        
        // 정상 종료가 아닌 경우에만 재연결 시도
        if (!event.wasClean && event.code !== 1000) {
          console.warn("WebSocket closed unexpectedly, attempting to reconnect in 3 seconds...");
          // 자동 재연결 로직 (3초 후)
          setTimeout(() => {
            if (currentRoomIdRef.current) {
              console.log("Attempting to reconnect WebSocket...");
              connectWebSocket(currentRoomIdRef.current);
            }
          }, 3000);
        }
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
  const handleSend = async () => {
    if (isSending.current || isComposing) return;
    if (!messageInput.trim() || !selectedChat) return;

    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      Alarm("⚠️", "채팅 연결이 되어있지 않습니다.", "#FF9800", "#FFF3E0");
      return;
    }

    isSending.current = true;
    const messageContent = messageInput.trim();
    const roomId = Number(selectedChat.id);

    // 백엔드 DTO에 맞게 receiver (username) 사용
    // 상대방 username 찾기
    let receiverUsername = selectedChat.partnerUsername;
    
    // partnerUsername이 없으면 채팅방 상세 정보에서 가져오기
    if (!receiverUsername) {
      console.log("⚠️ partnerUsername not found, fetching room detail...");
      const updatedChat = await updatePartnerInfo(selectedChat);
      
      if (updatedChat.partnerUsername) {
        receiverUsername = updatedChat.partnerUsername;
        // 상태 업데이트
        setSelectedChat(updatedChat);
        setChatList((prevList) =>
          prevList.map((chat) =>
            chat.id === roomId ? updatedChat : chat
          )
        );
      }
    }

    // 가이드에 따른 메시지 필드: sender, receiver, content, roomId, type, id, timestamp
    // receiver는 필수이며, 상대방 username을 지정해야 함
    if (!receiverUsername) {
      Alarm("❌", "상대방 정보를 찾을 수 없습니다.", "#FF1E1E", "#FFEAEA");
      isSending.current = false;
      return;
    }

    const messagePayload = {
      type: "TALK",
      receiver: receiverUsername, // 필수: 상대방 username
      content: messageContent,
      roomId: roomId
    };

    console.log("📤 Sending message to receiver:", receiverUsername);
    console.log("📤 RoomId:", roomId);

    // 전송 대기 중인 메시지로 표시 (중복 방지용)
    const messageKey = `${messageContent}-${Date.now()}`;
    pendingMessagesRef.current.add(messageKey);

    // Optimistic update: 전송한 메시지를 즉시 UI에 추가
    const tempMessage = {
      id: `temp-${Date.now()}`,
      sender: currentUsernameRef.current || "나",
      content: messageContent,
      time: new Date().toISOString(),
      isMine: true,
      roomId: roomId,
      type: "TALK",
      _pendingKey: messageKey // 중복 체크용 키
    };

    setMessages((prevMessages) => [...prevMessages, tempMessage]);
    setMessageInput("");

    try {
      ws.send(JSON.stringify(messagePayload));
      console.log("📤 Message sent via WebSocket:", messagePayload);
      console.log("📤 Full payload JSON:", JSON.stringify(messagePayload));
      console.log("📤 WebSocket readyState:", ws.readyState);
      console.log("📤 RoomId:", roomId, "Receiver:", receiverUsername);
    } catch (error) {
      console.error("❌ Failed to send message:", error);
      Alarm("❌", "메시지 전송에 실패했습니다.", "#FF1E1E", "#FFEAEA");
      // 전송 실패 시 임시 메시지 제거
      setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== tempMessage.id));
      pendingMessagesRef.current.delete(messageKey);
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
                  $isActive={selectedChat?.id === chat.id}
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
                        $isMine={isMine}
                        $isLastOfGroup={isLastOfGroup}
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

                        <S.MessageBubble $isMine={isMine}>
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
