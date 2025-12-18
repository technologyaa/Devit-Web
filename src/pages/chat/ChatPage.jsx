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
  const [searchParams, setSearchParams] = useSearchParams();
  const roomIdParam = searchParams.get("roomId");
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newWebSocketMessage, setNewWebSocketMessage] = useState(null); // WebSocket으로 받은 새 메시지
  const isSending = useRef(false);
  const messageListRef = useRef(null);
  const wsRef = useRef(null); // WebSocket 연결 참조
  const currentUserIdRef = useRef(null); // 현재 사용자 ID
  const currentUsernameRef = useRef(null); // 현재 사용자 username (WebSocket용)
  const currentRoomIdRef = useRef(null); // 현재 선택된 채팅방 ID
  const selectedChatRef = useRef(null); // 현재 선택된 채팅방 (ref)
  const chatListRef = useRef([]); // 채팅방 목록 (ref)
  const pendingMessagesRef = useRef(new Set()); // 전송 대기 중인 메시지 추적 (content 기반)
  // 나간 채팅방 ID를 localStorage에서 로드
  const loadLeftRoomIds = () => {
    try {
      const saved = localStorage.getItem('leftChatRoomIds');
      if (saved) {
        const ids = JSON.parse(saved);
        return new Set(ids.map(id => String(id)));
      }
    } catch (error) {
      console.warn("Failed to load left room IDs from localStorage:", error);
    }
    return new Set();
  };
  
  const saveLeftRoomIds = (ids) => {
    try {
      localStorage.setItem('leftChatRoomIds', JSON.stringify(Array.from(ids)));
    } catch (error) {
      console.warn("Failed to save left room IDs to localStorage:", error);
    }
  };
  
  const leftRoomIdsRef = useRef(loadLeftRoomIds()); // 나간 채팅방 ID 추적 (localStorage에서 복원)

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
      const formattedRooms = rooms.map((room, index) => {
        // 디버깅: 모든 room 객체의 필드 확인
        console.log(`📋 Room ${index} (ID: ${room.id || room.roomId}):`, room);
        console.log(`📋 Room ${index} keys:`, Object.keys(room));
        
        if (room.members && Array.isArray(room.members)) {
          console.log(`📋 Room ${index} members count:`, room.members.length);
          room.members.forEach((member, memberIndex) => {
            console.log(`📋 Room ${index} member ${memberIndex}:`, member);
            console.log(`📋 Room ${index} member ${memberIndex} keys:`, Object.keys(member));
            console.log(`📋 Room ${index} member ${memberIndex} all fields:`, {
              id: member.id,
              memberId: member.memberId,
              username: member.username,
              name: member.name,
              profileImage: member.profileImage,
              profile: member.profile,
              profileImageUrl: member.profileImageUrl,
              image: member.image,
              avatar: member.avatar,
              profileUrl: member.profileUrl,
              profilePicture: member.profilePicture
            });
          });
        } else {
          console.log(`📋 Room ${index} has no members array`);
        }
        
        // 상대방 정보 찾기 (PRIVATE 채팅방인 경우)
        let partnerUsername = null;
        let partnerName = room.name || room.roomName || room.partnerName || "채팅방";
        
        // 방법 1: members 배열에서 찾기
        let partnerProfileImage = null;
        if (room.members && Array.isArray(room.members)) {
          // 현재 사용자가 아닌 멤버 찾기
          const partner = room.members.find(m => 
            (m.id || m.memberId) !== currentUserIdRef.current &&
            (m.username || m.name || m.id)
          );
          if (partner) {
            partnerUsername = partner.username || partner.name || String(partner.id || partner.memberId);
            // 상대방 프로필 이미지 가져오기 (더 많은 필드명 시도)
            partnerProfileImage = partner.profileImage || 
                                 partner.profile || 
                                 partner.profileImageUrl ||
                                 partner.image ||
                                 partner.avatar ||
                                 partner.profileUrl ||
                                 partner.profilePicture ||
                                 partner.profilePictureUrl ||
                                 partner.photo ||
                                 partner.photoUrl ||
                                 null;
            
            console.log("👤 Partner found:", {
              id: partner.id || partner.memberId,
              username: partnerUsername,
              allKeys: Object.keys(partner),
              profileImage: partner.profileImage,
              profile: partner.profile,
              profileImageUrl: partner.profileImageUrl,
              image: partner.image,
              avatar: partner.avatar
            });
            // 상대방 이름만 사용 (채팅방 이름이 아닌 상대방 이름만)
            const partnerDisplayName = partner.username || partner.name;
            // 혹시 채팅방 이름 형식("hun & test1234")이 포함되어 있을 수 있으므로 필터링
            if (partnerDisplayName && currentUsernameRef.current) {
              const nameParts = partnerDisplayName.split(/ & | , /);
              const currentUsername = currentUsernameRef.current || '';
              const otherPartners = nameParts.filter(part => 
                part.trim().toLowerCase() !== currentUsername.toLowerCase() && part.trim() !== ''
              );
              partnerName = otherPartners.length > 0 ? otherPartners.join(' , ') : partnerDisplayName;
            } else {
              partnerName = partnerDisplayName || partnerName;
            }
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
            // 상대방 이름만 사용 (자신의 이름 제거)
            partnerName = otherPartners.join(' , '); // 여러 상대방이 있을 경우를 대비
          }
        }
        
        // 마지막 메시지 추출 (다양한 필드명 시도)
        let lastMessage = room.lastMessage || 
                         room.lastMessageContent || 
                         room.lastMessageText ||
                         room.latestMessage ||
                         room.recentMessage ||
                         room.message ||
                         "";
        
        // 의미 없는 메시지 필터링 (빈 문자열, 공백만, 이상한 문자들)
        if (lastMessage) {
          const trimmed = lastMessage.trim();
          // 빈 문자열이거나 공백만 있으면 제거
          if (trimmed === "" || 
              trimmed.length < 2 ||
              // 특수 문자 패턴 (□○ 등, 공백 포함)
              trimmed.match(/^[□○\s]+$/) || 
              trimmed.replace(/\s/g, '').match(/^[□○]+$/) ||
              // 깨진 한글 패턴 (자음/모음만 반복, 공백 포함)
              trimmed.match(/^[ㄱ-ㅎㅏ-ㅣ\s]+$/) ||
              trimmed.replace(/\s/g, '').match(/^[ㄱ-ㅎㅏ-ㅣ]+$/)) {
            lastMessage = "";
          }
        }
        
        // 채팅방 이름에서 자신의 이름 제거하고 상대방 이름만 표시
        let displayName = partnerName;
        const currentUsername = currentUsernameRef.current || '';
        
        if (partnerName && currentUsername) {
          // 다양한 구분자로 분리: " & ", " , ", ",", "&"
          const nameParts = partnerName.split(/ & | , |,|&/).map(part => part.trim()).filter(part => part !== '');
          
          // 현재 사용자 이름 제거 (대소문자 무시)
          const otherPartners = nameParts.filter(part => {
            const trimmedPart = part.trim();
            return trimmedPart.toLowerCase() !== currentUsername.toLowerCase() && trimmedPart !== '';
          });
          
          if (otherPartners.length > 0) {
            displayName = otherPartners.join(' , ');
          } else {
            // 자신의 이름만 있거나 매칭되지 않는 경우
            // partnerName이 currentUsername과 정확히 일치하는지 확인
            if (partnerName.trim().toLowerCase() === currentUsername.toLowerCase()) {
              displayName = "채팅방";
            } else {
              // 자신의 이름이 포함되어 있는지 다시 확인
              const lowerPartnerName = partnerName.toLowerCase();
              const lowerCurrentUsername = currentUsername.toLowerCase();
              if (lowerPartnerName.includes(lowerCurrentUsername)) {
                // 자신의 이름이 포함되어 있으면 제거 시도
                displayName = partnerName.replace(new RegExp(currentUsername, 'gi'), '').replace(/[&,]/g, '').trim();
                if (!displayName || displayName === '') {
                  displayName = "채팅방";
                }
              } else {
                displayName = partnerName.replace(/ & /g, ' , ');
              }
            }
          }
        } else if (partnerName) {
          displayName = partnerName.replace(/ & /g, ' , ');
        } else {
          displayName = "채팅방";
        }
        
        // 마지막 메시지 시간 추출 (정렬용)
        const lastMessageTime = room.lastMessageTime || 
                               room.lastMessageTimestamp || 
                               room.updatedAt || 
                               room.modifiedAt ||
                               room.createdAt ||
                               null;

        // 프로필 이미지 URL 생성
        const profileImageSource = partnerProfileImage || 
                                  room.profileImage || 
                                  room.profile || 
                                  room.profileImageUrl ||
                                  room.image ||
                                  room.avatar ||
                                  null;
        
        // 프로필 이미지 URL 생성 (null, 빈 문자열, "null" 문자열 모두 처리)
        let profileImageUrl = "/assets/profile-icon.svg";
        if (profileImageSource && 
            profileImageSource !== "" && 
            profileImageSource !== "null" && 
            String(profileImageSource).trim() !== "") {
          const processedUrl = getImageUrl(profileImageSource);
          // getImageUrl이 유효한 URL을 반환하는지 확인
          if (processedUrl && processedUrl !== "/assets/profile-icon.svg") {
            profileImageUrl = processedUrl;
          }
        }
        
        console.log("📸 Room:", room.id, "displayName:", displayName);
        console.log("📸 Partner profile image source:", partnerProfileImage);
        console.log("📸 Room profile image fields:", {
          roomProfileImage: room.profileImage,
          roomProfile: room.profile,
          roomProfileImageUrl: room.profileImageUrl,
          roomImage: room.image,
          roomAvatar: room.avatar,
          roomProfileUrl: room.profileUrl,
          roomProfilePicture: room.profilePicture
        });
        console.log("📸 Profile image source:", profileImageSource);
        console.log("📸 Final profile image URL:", profileImageUrl);
        
        const chatRoom = {
          id: room.id || room.roomId,
          userName: displayName,
          userProfile: profileImageUrl,
          lastMessage: lastMessage,
          lastMessageTime: lastMessageTime, // 정렬용
          partnerUsername: partnerUsername, // WebSocket 메시지 전송용
          messages: [], // 메시지는 별도로 로드
          unreadCount: room.unreadCount || room.unreadMessageCount || 0 // 읽지 않은 메시지 개수
        };
        
        console.log("📸 Created chat room:", chatRoom.id, "userProfile:", chatRoom.userProfile);
        
        return chatRoom;
      });
      
      // 나간 채팅방 필터링 (localStorage에서도 확인)
      const filteredRooms = formattedRooms.filter(room => {
        const roomIdStr = String(room.id);
        const shouldKeep = !leftRoomIdsRef.current.has(roomIdStr);
        if (!shouldKeep) {
          console.log("🚫 Filtering out left room:", room.id);
        }
        return shouldKeep;
      });
      
      console.log("Formatted rooms:", formattedRooms.length, "After filtering left rooms:", filteredRooms.length);
      
      // 채팅방 목록 업데이트 (기존 chatList의 lastMessage 유지)
      const updatedRooms = (() => {
        // 새로고침 시 prevChatList가 비어있을 수 있으므로 filteredRooms를 그대로 사용
        if (chatListRef.current.length === 0) {
          console.log("📋 No previous chat list, using filtered rooms directly");
          return filteredRooms;
        }
        
        return filteredRooms.map((newRoom) => {
          // 기존 채팅방에서 같은 ID 찾기
          const existingRoom = chatListRef.current.find(room => room.id === newRoom.id);
          
          // API 응답에 lastMessage가 없거나 비어있고, 기존에 lastMessage가 있으면 유지
          if ((!newRoom.lastMessage || newRoom.lastMessage === "") && 
              existingRoom && 
              existingRoom.lastMessage && 
              existingRoom.lastMessage !== "") {
            return {
              ...newRoom,
              lastMessage: existingRoom.lastMessage
            };
          }
          
          return newRoom;
        });
      })();
      
      // 정렬 없이 원래 순서 유지
      const sortedRooms = updatedRooms;
      
      console.log("📋 Sorted rooms:", sortedRooms);
      setChatList(sortedRooms);
      
      // members 배열이 없는 경우, 각 채팅방의 상세 정보를 가져와서 프로필 이미지 업데이트
      const updateProfileImages = async () => {
        console.log("🔄 Starting profile image update for", sortedRooms.length, "rooms");
        
        // 원래 순서를 유지하기 위해 인덱스와 함께 저장
        const roomsWithIndex = sortedRooms.map((chat, index) => ({ chat, originalIndex: index }));
        
        // 먼저 모든 개발자 목록을 가져와서 캐시
        let developersCache = null;
        try {
          const token = Cookies.get("accessToken");
          const headers = { "Accept": "application/json" };
          if (token && token !== "logged-in") {
            headers["Authorization"] = `Bearer ${token}`;
          }
          
          const devsResponse = await axios.get(`${API_URL}/auth/developers`, {
            headers,
            withCredentials: true
          });
          const devsData = devsResponse.data?.data || devsResponse.data || [];
          developersCache = Array.isArray(devsData) ? devsData : [];
          console.log("📋 Loaded developers cache:", developersCache.length, "developers");
        } catch (error) {
          console.warn("⚠️ Failed to load developers cache:", error);
        }
        
        const updatedChatList = await Promise.all(
          roomsWithIndex.map(async ({ chat, originalIndex }) => {
            // 이미 프로필 이미지가 있으면 스킵
            if (chat.userProfile && chat.userProfile !== "/assets/profile-icon.svg") {
              console.log("⏭️ Skipping chat", chat.id, "already has profile:", chat.userProfile);
              return { chat, originalIndex };
            }
            
            console.log("🔍 Fetching room detail for chat:", chat.id, "userName:", chat.userName);
            try {
              const roomData = await fetchRoomDetail(chat.id);
              console.log("📋 Room detail for chat", chat.id, ":", roomData);
              
              // 방법 1: members 배열이 있는 경우
              if (roomData && roomData.members && Array.isArray(roomData.members)) {
                console.log("👥 Found", roomData.members.length, "members in room", chat.id);
                roomData.members.forEach((member, index) => {
                  console.log(`👤 Member ${index}:`, member);
                  console.log(`👤 Member ${index} keys:`, Object.keys(member));
                });
                
                const partner = roomData.members.find(m => 
                  (m.id || m.memberId) !== currentUserIdRef.current &&
                  (m.username || m.name || m.id)
                );
                
                if (partner) {
                  console.log("✅ Found partner for chat", chat.id, ":", partner);
                  const partnerProfileImage = partner.profileImage || 
                                             partner.profile || 
                                             partner.profileImageUrl ||
                                             partner.image ||
                                             partner.avatar ||
                                             partner.profileUrl ||
                                             partner.profilePicture ||
                                             partner.profilePictureUrl ||
                                             partner.photo ||
                                             partner.photoUrl ||
                                             null;
                  
                  console.log("🖼️ Partner profile image source for chat", chat.id, ":", partnerProfileImage);
                  
                  if (partnerProfileImage) {
                    const profileImageUrl = getImageUrl(partnerProfileImage);
                    console.log("🔄 Updated profile for chat:", chat.id, "from room detail, URL:", profileImageUrl);
                    return {
                      chat: {
                        ...chat,
                        userProfile: profileImageUrl
                      },
                      originalIndex
                    };
                  } else {
                    console.log("⚠️ No profile image found for partner in chat", chat.id);
                  }
                } else {
                  console.log("⚠️ No partner found in members for chat", chat.id);
                }
              } 
              // 방법 2: memberIds만 있는 경우, 상대방 ID로 프로필 정보 가져오기
              else if (roomData && roomData.memberIds && Array.isArray(roomData.memberIds)) {
                console.log("👥 Found memberIds in room", chat.id, ":", roomData.memberIds);
                const partnerId = roomData.memberIds.find(id => 
                  String(id) !== String(currentUserIdRef.current)
                );
                
                if (partnerId) {
                  console.log("🔍 Found partner ID:", partnerId, "for chat", chat.id);
                  
                    // 상대방 프로필 정보 가져오기
                    try {
                      const token = Cookies.get("accessToken");
                      const headers = { "Accept": "application/json" };
                      if (token && token !== "logged-in") {
                        headers["Authorization"] = `Bearer ${token}`;
                      }
                      
                      // 방법 2-1: 개발자 캐시에서 찾기 (가장 효율적)
                      if (developersCache && developersCache.length > 0) {
                        const developer = developersCache.find(dev => {
                          const devMemberId = dev.memberId || dev.id;
                          return devMemberId === partnerId || 
                                 String(devMemberId) === String(partnerId) ||
                                 (dev.username && dev.username === chat.userName) ||
                                 (dev.githubId && dev.githubId === chat.userName);
                        });
                        
                        if (developer) {
                          console.log("✅ Found developer in cache for chat", chat.id, ":", developer);
                          const profileImage = developer.profile || 
                                             developer.profileImage || 
                                             developer.profileImageUrl ||
                                             developer.image ||
                                             null;
                          
                          if (profileImage) {
                            const profileImageUrl = getImageUrl(profileImage);
                            console.log("🔄 Updated profile for chat:", chat.id, "from developers cache, URL:", profileImageUrl);
                            return {
                              chat: {
                                ...chat,
                                userProfile: profileImageUrl
                              },
                              originalIndex
                            };
                          }
                        }
                      }
                      
                      // 방법 2-2: /profile/{memberId} 시도
                      try {
                        const profileResponse = await axios.get(`${API_URL}/profile/${partnerId}`, {
                          headers,
                          withCredentials: true
                        });
                        const profileData = profileResponse.data?.data || profileResponse.data || {};
                        console.log("👤 Profile data for ID", partnerId, ":", profileData);
                        
                        const profileImage = profileData.profile || 
                                           profileData.profileImage || 
                                           profileData.profileImageUrl ||
                                           profileData.image ||
                                           null;
                        
                        if (profileImage) {
                          const profileImageUrl = getImageUrl(profileImage);
                          console.log("🔄 Updated profile for chat:", chat.id, "from profile API, URL:", profileImageUrl);
                          return {
                            chat: {
                              ...chat,
                              userProfile: profileImageUrl
                            },
                            originalIndex
                          };
                        }
                      } catch (profileError) {
                        // 403 (Forbidden) 또는 404 (Not Found)는 정상적인 경우일 수 있음 (비공개 프로필, 탈퇴한 사용자 등)
                        const status = profileError.response?.status;
                        if (status === 403 || status === 404) {
                          console.log("ℹ️ Profile not accessible for ID", partnerId, "(status:", status, "- using default image)");
                        } else {
                          console.log("⚠️ Failed to fetch profile info for ID", partnerId, profileError);
                        }
                      }
                    } catch (error) {
                      console.warn("⚠️ Failed to fetch profile for partner ID", partnerId, error);
                    }
                } else {
                  console.log("⚠️ No partner ID found in memberIds for chat", chat.id);
                }
              } else {
                console.log("⚠️ No members array or memberIds in room data for chat", chat.id);
              }
            } catch (error) {
              console.warn("⚠️ Failed to fetch room detail for chat:", chat.id, error);
            }
            
            return { chat, originalIndex };
          })
        );
        
        // 원래 순서대로 정렬
        updatedChatList.sort((a, b) => a.originalIndex - b.originalIndex);
        
        // chat 객체만 추출
        const finalChatList = updatedChatList.map(item => item.chat);
        
        console.log("🔄 Updated chat list with profile images (order preserved)");
        setChatList(finalChatList);
      };
      
      // 프로필 이미지 업데이트 (비동기로 실행, UI 블로킹 방지)
      updateProfileImages();
      
      // roomId 파라미터가 있으면 해당 채팅방 선택, 없으면 첫 번째 채팅방 선택
      // 항상 채팅방 선택 및 메시지 로드
      if (formattedRooms.length > 0) {
        let roomToSelect = null;
        const currentSelectedId = selectedChatRef.current?.id;
        
        if (roomIdParam) {
          // URL 파라미터로 전달된 roomId 찾기
          roomToSelect = formattedRooms.find(room => 
            String(room.id) === String(roomIdParam)
          );
          console.log("🔍 Looking for roomId from URL:", roomIdParam, "Found:", roomToSelect);
        }
        // roomId로 찾지 못했거나 roomId가 없으면 기존 선택된 채팅방 또는 첫 번째 채팅방 선택
        if (!roomToSelect) {
          // 기존에 선택된 채팅방이 있으면 그 채팅방 유지
          if (currentSelectedId) {
            roomToSelect = formattedRooms.find(room => String(room.id) === String(currentSelectedId));
          }
          // 기존 선택된 채팅방을 찾지 못했으면 첫 번째 채팅방 선택
          if (!roomToSelect) {
            roomToSelect = formattedRooms[0];
            console.log("🔍 No roomId in URL or not found, selecting first room:", roomToSelect.id);
          } else {
            console.log("🔍 Keeping previously selected room:", roomToSelect.id);
          }
        }
        
        // 채팅방 선택
        const isSameRoom = currentSelectedId && String(roomToSelect.id) === String(currentSelectedId);
        console.log("✅ Selecting chat room:", roomToSelect.id, "isSameRoom:", isSameRoom, "currentSelectedId:", currentSelectedId);
        
        // URL에 roomId 저장 (새로고침 시 같은 채팅방으로 이동)
        if (String(roomToSelect.id) !== roomIdParam) {
          setSearchParams({ roomId: String(roomToSelect.id) }, { replace: true });
        }
        
        // 채팅방 선택 및 메시지 로드
        setSelectedChat(roomToSelect);
        
        // 같은 채팅방이 아니면 메시지 로드 (useEffect에서도 처리되지만 확실하게)
        if (!isSameRoom) {
          console.log("🔄 New room selected, will load messages via useEffect");
        } else {
          console.log("🔄 Same room selected, reloading messages immediately");
          // 약간의 지연을 두어 상태 업데이트가 완료되도록 함
          setTimeout(() => {
            fetchMessages(roomToSelect.id);
            
            // WebSocket 연결 상태 확인 및 필요시 재연결
            const ws = wsRef.current;
            if (ws && ws.readyState === WebSocket.OPEN && currentRoomIdRef.current === roomToSelect.id) {
              console.log("✅ WebSocket already connected for same room, no need to reconnect");
            } else if (currentUsernameRef.current) {
              console.log("🔄 WebSocket not connected, reconnecting for same room:", roomToSelect.id);
              connectWebSocket(roomToSelect.id);
            }
          }, 50);
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
      
      // 메시지가 있으면 채팅방 목록의 마지막 메시지 업데이트 및 정렬
      if (formattedMessages.length > 0) {
        const lastMessage = formattedMessages[formattedMessages.length - 1];
        const lastMessageContent = lastMessage.content || "";
        const lastMessageTime = lastMessage.time || new Date().toISOString();
        
        // 현재 선택된 채팅방이면 읽지 않은 메시지 개수 0으로 설정
        const isCurrentRoom = String(roomId) === String(currentRoomIdRef.current);
        
        setChatList((prevChatList) => {
          const updated = prevChatList.map((chat) =>
            chat.id === roomId
              ? { 
                  ...chat, 
                  lastMessage: lastMessageContent,
                  lastMessageTime: lastMessageTime,
                  unreadCount: isCurrentRoom ? 0 : (chat.unreadCount || 0)
                }
              : chat
          );
          
          // 정렬 없이 원래 순서 유지
          return updated;
        });
      } else {
        console.log("ℹ️ No messages found for this room (empty array returned)");
        // 메시지가 없어도 현재 선택된 채팅방이면 읽지 않은 메시지 개수 0으로 설정
        const isCurrentRoom = String(roomId) === String(currentRoomIdRef.current);
        if (isCurrentRoom) {
          setChatList((prevChatList) =>
            prevChatList.map((chat) =>
              chat.id === roomId
                ? { ...chat, unreadCount: 0 }
                : chat
            )
          );
        }
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
          console.error("❌ Server error details:", {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            roomId: roomId,
            userId: currentUserIdRef.current,
            username: currentUsernameRef.current
          });
          // 서버 에러 응답에서 메시지 추출 시도
          const errorMessage = error.response.data?.message || 
                              error.response.data?.error || 
                              error.response.data?.data?.message ||
                              "서버 오류가 발생했습니다.";
          Alarm("❌", `서버 오류: ${errorMessage}`, "#FF1E1E", "#FFEAEA");
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
        // 상대방 이름만 사용 (자신의 이름 제거)
        let partnerName = partner.username || partner.name || "채팅방";
        
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
        
        // 채팅방 이름에서 자신의 이름 제거하고 상대방 이름만 사용
        let partnerName = "채팅방";
        if (roomData.name && typeof roomData.name === 'string') {
          const nameParts = roomData.name.split(' & ');
          const currentUsername = currentUsernameRef.current || '';
          const otherPartners = nameParts.filter(part => 
            part.toLowerCase() !== currentUsername.toLowerCase() && 
            part.trim() !== ''
          );
          if (otherPartners.length > 0) {
            partnerName = otherPartners.join(' , ');
          } else if (partnerUsername) {
            partnerName = partnerUsername;
          }
        } else if (partnerUsername) {
          partnerName = partnerUsername;
        }
        
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
        
        // 상대방 이름만 사용 (자신의 이름 제거)
        const displayName = otherPartners.join(' , ');
        
        return {
          ...chat,
          partnerUsername,
          userName: displayName,
          userProfile: chat.userProfile || getImageUrl(roomData.profileImage)
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
        if (token && token !== "logged-in") {
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
          
          // 사용자 정보를 가져온 후 채팅방 목록 로드 (이름 필터링을 위해 필요)
          await fetchChatRooms();
        } else {
          // 토큰이 없어도 채팅방 목록은 로드 시도
          await fetchChatRooms();
        }
      } catch (error) {
        console.warn("Failed to get current user info:", error);
        // 에러가 발생해도 채팅방 목록은 로드 시도
        await fetchChatRooms();
      }
    };

    getCurrentUser();
  }, []);

  // roomId 파라미터 변경 시 채팅방 목록 다시 로드하지 않음
  // (채팅방 선택은 handleSelectChat에서 처리하고, fetchChatRooms는 초기 로드와 페이지 포커스 시에만 호출)
  // 이렇게 하면 WebSocket이 불필요하게 끊어지지 않음
  
  // 페이지 포커스 시 채팅방 목록 새로고침 (다른 페이지에서 돌아올 때)
  useEffect(() => {
    const handleFocus = async () => {
      console.log("🔄 Page focused, refreshing chat rooms");
      if (currentUsernameRef.current) {
        // 현재 선택된 채팅방 ID 저장
        const currentRoomId = selectedChatRef.current?.id || currentRoomIdRef.current;
        console.log("🔄 Current room ID before refresh:", currentRoomId);
        
        await fetchChatRooms();
        
        // 채팅방 목록 새로고침 후, 선택된 채팅방이 있으면 메시지 다시 로드
        const roomIdToLoad = selectedChatRef.current?.id || currentRoomId;
        if (roomIdToLoad) {
          console.log("🔄 Reloading messages for room:", roomIdToLoad);
          // 약간의 지연을 두어 상태 업데이트가 완료되도록 함
          setTimeout(() => {
            fetchMessages(roomIdToLoad);
            
            // WebSocket 연결 상태 확인 및 필요시 재연결
            const ws = wsRef.current;
            if (ws && ws.readyState === WebSocket.OPEN && currentRoomIdRef.current === roomIdToLoad) {
              console.log("✅ WebSocket already connected, no need to reconnect");
            } else if (currentUsernameRef.current) {
              console.log("🔄 WebSocket not connected or different room, reconnecting...");
              connectWebSocket(roomIdToLoad);
            }
          }, 100);
        }
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
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
        
        // 메시지 로드 (항상 실행)
        console.log("📥 Loading messages for room:", updatedChat.id);
        await fetchMessages(updatedChat.id);
        
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

    // 컴포넌트 언마운트 시 WebSocket 연결 해제하지 않음 (페이지 이동 시에만 해제)
    return () => {
      // cleanup은 하지 않음 (채팅방 변경 시 WebSocket은 connectWebSocket에서 처리)
    };
  }, [selectedChat?.id]); // selectedChat.id만 의존성으로 사용하여 무한 루프 방지

  // selectedChat과 chatList를 ref에 동기화
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    chatListRef.current = chatList;
    
    // 전체 읽지 않은 메시지 개수 계산
    const totalUnread = chatList.reduce((sum, chat) => {
      return sum + (chat.unreadCount || 0);
    }, 0);
    
    console.log("📊 ChatPage - Total unread count:", totalUnread, "from", chatList.length, "rooms");
    
    // SideBar에 업데이트 알림
    window.dispatchEvent(new CustomEvent('chatListUpdated', { 
      detail: { totalUnreadCount: totalUnread } 
    }));
    console.log("📤 ChatPage - Dispatched chatListUpdated event with totalUnreadCount:", totalUnread);
  }, [chatList]);

  // WebSocket 연결 상태 주기적 확인
  useEffect(() => {
    if (!selectedChat || !selectedChat.id) return;

    const checkConnection = setInterval(() => {
      const ws = wsRef.current;
      if (ws) {
        console.log("🔍 WebSocket connection check - readyState:", ws.readyState, "OPEN:", WebSocket.OPEN);
        if (ws.readyState !== WebSocket.OPEN) {
          console.warn("⚠️ WebSocket is not open, reconnecting...");
          if (currentRoomIdRef.current && currentUsernameRef.current) {
            connectWebSocket(currentRoomIdRef.current);
          }
        }
      } else {
        console.warn("⚠️ WebSocket is null, reconnecting...");
        if (currentRoomIdRef.current && currentUsernameRef.current) {
          connectWebSocket(currentRoomIdRef.current);
        }
      }
    }, 5000); // 5초마다 체크

    return () => {
      clearInterval(checkConnection);
    };
  }, [selectedChat?.id]);

  // WebSocket으로 받은 새 메시지 처리
  useEffect(() => {
    if (!newWebSocketMessage) {
      return; // null이면 처리하지 않음 (초기화 시 발생)
    }
    
    console.log("📨 Processing new WebSocket message:", newWebSocketMessage);
    
    const data = newWebSocketMessage;
    
    // 문서에 따르면: roomId로 필터링 (문서 96번째 줄 참고)
    // "채팅방 메시지인 경우에만 처리 (roomId가 일치하는 경우)"
    const messageRoomId = data.roomId ? Number(data.roomId) : null;
    const currentRoomId = currentRoomIdRef.current ? Number(currentRoomIdRef.current) : null;
    
    // roomId가 일치하는 경우에만 처리 (문서 기준)
    const isForCurrentChat = messageRoomId && currentRoomId && messageRoomId === currentRoomId;
    
    // 현재 선택된 채팅방이 아닌 경우 읽지 않은 메시지 개수 증가
    if (!isForCurrentChat && messageRoomId) {
      const isMine = data.sender === currentUsernameRef.current || 
                     data.senderName === currentUsernameRef.current ||
                     data.senderId === currentUserIdRef.current;
      
      // 내가 보낸 메시지가 아니면 읽지 않은 메시지 개수 증가
      if (!isMine) {
        setChatList((prevChatList) =>
          prevChatList.map((chat) =>
            chat.id === messageRoomId
              ? { ...chat, unreadCount: (chat.unreadCount || 0) + 1 }
              : chat
          )
        );
      }
      
      // 마지막 메시지 업데이트
      const messageContent = data.content || data.message || "";
      setChatList((prevChatList) =>
        prevChatList.map((chat) =>
          chat.id === messageRoomId
            ? { ...chat, lastMessage: messageContent }
            : chat
        )
      );
      
      console.log("⚠️ Message filtered out - roomId mismatch:", {
        messageRoomId: messageRoomId,
        currentRoomId: currentRoomId,
        sender: data.sender
      });
      setNewWebSocketMessage(null);
      return;
    }
    
    console.log("✅ Message matches current chat room - roomId:", messageRoomId);
    
    if (isForCurrentChat) {
      const isMine = data.sender === currentUsernameRef.current || 
                    data.senderName === currentUsernameRef.current ||
                    data.senderId === currentUserIdRef.current;
      
      const messageContent = data.content || data.message || "";
      
      // 메시지 추가
      setMessages((prevMessages) => {
        // 내가 보낸 메시지인 경우, optimistic update로 추가된 임시 메시지 찾아서 교체
        if (isMine) {
          const tempMessageIndex = prevMessages.findIndex(msg => 
            msg.id?.toString().startsWith('temp-') &&
            msg.content === messageContent &&
            msg.isMine === true
          );

          if (tempMessageIndex !== -1) {
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

        // 중복 메시지 체크
        const exists = prevMessages.some(msg => {
          if (msg.id === newMessage.id) return true;
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

      // 채팅방 목록의 마지막 메시지 업데이트 및 읽지 않은 메시지 개수 0으로 설정 및 정렬
      const messageTime = data.timestamp || data.createdAt || new Date().toISOString();
      setChatList((prevChatList) => {
        const updated = prevChatList.map((chat) => 
          chat.id === currentRoomIdRef.current
            ? { ...chat, lastMessage: messageContent, lastMessageTime: messageTime, unreadCount: 0 }
            : chat
        );
        
        // 정렬 없이 원래 순서 유지
        return updated;
      });
      
      // 메시지 처리 완료 후 상태 초기화
      setNewWebSocketMessage(null);
    }
  }, [newWebSocketMessage]);

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
    
    // 기존 연결이 있으면 상태 확인
    if (wsRef.current) {
      const existingWs = wsRef.current;
      console.log("🔍 Existing WebSocket found, readyState:", existingWs.readyState);
      console.log("🔍 WebSocket.OPEN =", WebSocket.OPEN);
      console.log("🔍 Is already open?", existingWs.readyState === WebSocket.OPEN);
      
      // 이미 열려있고 같은 roomId면 재연결하지 않음
      if (existingWs.readyState === WebSocket.OPEN && currentRoomIdRef.current === roomId) {
        console.log("✅ WebSocket already connected for this room, skipping reconnection");
        return;
      }
      
      // 기존 연결 닫기
      console.log("🔌 Closing existing WebSocket connection");
      existingWs.close();
      wsRef.current = null;
    }

    // 문서에 따르면: wss://devit.run/ws/chat?username={사용자명}
    const wsUrl = `${WS_URL}/ws/chat?username=${encodeURIComponent(currentUsernameRef.current)}`;
    console.log("🔌 Connecting to WebSocket:", wsUrl);
    console.log("🔌 Username:", currentUsernameRef.current);
    console.log("🔌 Room ID:", roomId);

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      currentRoomIdRef.current = roomId;

      ws.onopen = () => {
        console.log("✅ WebSocket connected to:", wsUrl);
        console.log("✅ WebSocket readyState:", ws.readyState);
        console.log("✅ WebSocket.OPEN =", WebSocket.OPEN);
        console.log("✅ WebSocket is ready to receive messages");
        console.log("✅ Current roomId:", currentRoomIdRef.current);
        console.log("✅ Current username:", currentUsernameRef.current);
        Alarm("✅", "실시간 채팅이 연결되었습니다.", "#3CAF50", "#E8F5E9");
        
        // 연결 확인: 1초 후 WebSocket 상태 체크
        setTimeout(() => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            console.log("✅ WebSocket still connected after 1 second");
          } else {
            console.warn("⚠️ WebSocket connection lost after 1 second");
          }
        }, 1000);
      };

      ws.onmessage = (event) => {
        console.log("🔔 WebSocket onmessage triggered!");
        console.log("🔔 Raw event.data:", event.data);
        console.log("🔔 Event type:", typeof event.data);
        
        try {
          const data = JSON.parse(event.data);
          console.log("📨 WebSocket message received:", data);
          console.log("📨 Message type:", data.type);
          console.log("📨 Message sender:", data.sender);
          console.log("📨 Message receiver:", data.receiver);
          console.log("📨 Message content:", data.content);
          
          // 에러 메시지 처리
          if (data.error) {
            console.error("❌ WebSocket error message:", data.error);
            Alarm("❌", `메시지 처리 오류: ${data.error}`, "#FF1E1E", "#FFEAEA");
            return;
          }
          
          // 메시지 타입 확인
          if (data.type === "TALK" || data.type === "MESSAGE" || data.type === "CHAT" || !data.type) {
            console.log("✅ Message type is valid, setting newWebSocketMessage");
            // 새 메시지를 상태로 업데이트 (useEffect에서 처리)
            setNewWebSocketMessage(data);
            console.log("✅ newWebSocketMessage state updated");
          } else {
            console.log("⚠️ Unknown message type:", data.type);
          }
        } catch (error) {
          console.error("❌ Failed to parse WebSocket message:", error);
          console.error("❌ Raw message:", event.data);
          console.error("❌ Error stack:", error.stack);
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
        
        // 정상 종료(1000)이거나 의도적으로 닫은 경우 재연결하지 않음
        if (event.wasClean && event.code === 1000) {
          console.log("WebSocket closed cleanly, no reconnection needed");
          return;
        }
        
        // 정상 종료가 아닌 경우에만 재연결 시도
        if (!event.wasClean && event.code !== 1000) {
          console.warn("WebSocket closed unexpectedly, attempting to reconnect in 3 seconds...");
          // 자동 재연결 로직 (3초 후)
          setTimeout(() => {
            if (currentRoomIdRef.current && selectedChatRef.current?.id === currentRoomIdRef.current) {
              console.log("Attempting to reconnect WebSocket...");
              connectWebSocket(currentRoomIdRef.current);
            } else {
              console.log("Room changed or no room selected, skipping reconnection");
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
    console.log("📤 Checking WebSocket before send - ws exists:", !!ws, "readyState:", ws?.readyState, "OPEN:", WebSocket.OPEN);
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error("❌ WebSocket not ready - ws:", ws, "readyState:", ws?.readyState);
      Alarm("⚠️", "채팅 연결이 되어있지 않습니다.", "#FF9800", "#FFF3E0");
      // 연결이 끊어졌으면 재연결 시도
      if (currentRoomIdRef.current && currentUsernameRef.current) {
        console.log("🔄 Attempting to reconnect WebSocket...");
        connectWebSocket(currentRoomIdRef.current);
      }
      isSending.current = false;
      return;
    }

    isSending.current = true;
    const messageContent = messageInput.trim();
    const roomId = Number(selectedChat.id);

    // 문서에 따르면 채팅방 메시지 전송 형식: { sender, content, roomId, type }
    // (문서 FRONTEND_WEBSOCKET_GUIDE.md 268-277번째 줄 참고)
    if (!currentUsernameRef.current) {
      Alarm("❌", "사용자 정보를 찾을 수 없습니다.", "#FF1E1E", "#FFEAEA");
      isSending.current = false;
      return;
    }

    const messagePayload = {
      sender: currentUsernameRef.current, // 발신자 사용자명 (필수)
      content: messageContent, // 메시지 내용 (필수)
      roomId: roomId, // 채팅방 ID (필수)
      type: "TALK" // 메시지 타입 (기본값: "TALK")
    };

    console.log("📤 Sending message - RoomId:", roomId, "Sender:", currentUsernameRef.current);

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
      console.log("📤 RoomId:", roomId, "Sender:", currentUsernameRef.current);
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

  // 채팅방 선택 핸들러 (URL도 함께 업데이트)
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    // URL에 roomId 저장 (새로고침 시 같은 채팅방으로 이동)
    // replace: true로 설정하여 history에 추가하지 않음 (불필요한 재렌더링 방지)
    if (String(chat.id) !== roomIdParam) {
      setSearchParams({ roomId: String(chat.id) }, { replace: true });
    }
    // 선택한 채팅방의 읽지 않은 메시지 개수 0으로 설정
    setChatList((prevChatList) =>
      prevChatList.map((c) =>
        c.id === chat.id ? { ...c, unreadCount: 0 } : c
      )
    );
  };

  // 채팅방 나가기 핸들러
  const handleLeaveChat = async () => {
    if (!selectedChat || !selectedChat.id) {
      Alarm("⚠️", "선택된 채팅방이 없습니다.", "#FF9800", "#FFF3E0");
      return;
    }

    const roomId = selectedChat.id;
    const roomName = selectedChat.userName;

    // 확인 메시지
    if (!window.confirm(`"${roomName}" 채팅방을 나가시겠습니까?`)) {
      return;
    }

    // 나간 채팅방 ID를 추적에 추가 (localStorage에도 저장)
    leftRoomIdsRef.current.add(String(roomId));
    saveLeftRoomIds(leftRoomIdsRef.current);
    console.log("🚪 Added room to left rooms list:", roomId, "Total left rooms:", leftRoomIdsRef.current.size);
    
    // 먼저 클라이언트에서 즉시 제거 (UI 반응성 향상)
    console.log("🚪 Removing chat room from UI immediately:", roomId);
    setChatList((prevChatList) => {
      const filtered = prevChatList.filter(chat => chat.id !== roomId);
      console.log("📋 Chat list before:", prevChatList.length, "after:", filtered.length);
      return filtered;
    });
    
    // WebSocket 연결 종료
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // 선택된 채팅방 해제
    setSelectedChat(null);
    setMessages([]);
    setSearchParams({}, { replace: true });

    try {
      const token = Cookies.get("accessToken");
      const headers = {
        "Accept": "application/json"
      };
      
      if (token && token !== "logged-in") {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // 채팅방 나가기/삭제 API 호출
      console.log("🚪 Calling API to leave/delete chat room:", roomId);
      
      // 여러 가능한 엔드포인트 시도 (나가기와 삭제 모두 시도)
      let success = false;
      let lastError = null;
      const endpoints = [
        `${API_URL}/chat/rooms/${roomId}/leave`,
        `${API_URL}/chat/rooms/${roomId}`,
        `${API_URL}/chat/rooms/${roomId}/members/me`,
        `${API_URL}/chat/rooms/${roomId}/delete`
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 Trying endpoint: ${endpoint}`);
          const response = await axios.delete(endpoint, {
            headers,
            withCredentials: true
          });
          
          console.log(`✅ Response from ${endpoint}:`, response.status, response.data);
          
          // 200, 204, 201 모두 성공으로 간주
          if (response.status === 200 || response.status === 204 || response.status === 201) {
            console.log("✅ Successfully left/deleted chat room:", roomId);
            success = true;
            break;
          }
        } catch (error) {
          const status = error.response?.status;
          const data = error.response?.data;
          console.log(`⚠️ Failed to leave/delete with ${endpoint}:`, status, data || error.message);
          lastError = error;
          
          // 404는 이미 삭제된 것으로 간주할 수 있음
          if (status === 404) {
            console.log("ℹ️ Room not found (404) - may already be deleted");
            success = true;
            break;
          }
          continue;
        }
      }

      // 서버에서 최신 목록을 다시 가져오기 (나간 채팅방이 목록에서 제거되었는지 확인)
      console.log("🔄 Refreshing chat list after leaving room...");
      await fetchChatRooms();
      
      // 새로고침 후에도 해당 채팅방이 있으면 다시 제거
      setChatList((prevChatList) => {
        const stillExists = prevChatList.some(chat => chat.id === roomId);
        if (stillExists) {
          console.warn("⚠️ Room still exists after refresh, removing again:", roomId);
          return prevChatList.filter(chat => chat.id !== roomId);
        }
        return prevChatList;
      });

      if (success || lastError?.response?.status === 404) {
        Alarm("✅", "채팅방을 나갔습니다.", "#3CAF50", "#E8F5E9");
      } else {
        Alarm("⚠️", "채팅방 나가기 요청이 완료되지 않았을 수 있습니다. 목록을 새로고침했습니다.", "#FF9800", "#FFF3E0");
      }
    } catch (error) {
      console.error("❌ Failed to leave chat room:", error);
      // 에러가 발생해도 이미 클라이언트에서 제거했으므로 목록만 새로고침
      await fetchChatRooms();
      Alarm("⚠️", "채팅방 나가기 중 오류가 발생했습니다. 목록을 새로고침했습니다.", "#FF9800", "#FFF3E0");
    }
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
                  onClick={() => handleSelectChat(chat)}
                  $isActive={selectedChat?.id === chat.id}
                >
                  <S.ChatProfile
                    src={(() => {
                      const imgSrc = chat.userProfile && 
                                    chat.userProfile !== "" && 
                                    chat.userProfile !== "null" && 
                                    chat.userProfile !== null
                                    ? chat.userProfile 
                                    : "/assets/profile-icon.svg";
                      console.log("🖼️ Rendering profile for chat:", chat.id, "userName:", chat.userName, "src:", imgSrc, "original userProfile:", chat.userProfile);
                      return imgSrc;
                    })()}
                    alt={chat.userName}
                    onError={(e) => {
                      console.log("❌ Image load error for chat:", chat.id, "userName:", chat.userName, "attempted src:", e.target.src);
                      if (e.target.src !== "/assets/profile-icon.svg" && !e.target.src.includes("profile-icon.svg")) {
                        e.target.src = "/assets/profile-icon.svg";
                      }
                    }}
                    onLoad={() => {
                      console.log("✅ Image loaded successfully for chat:", chat.id, "userName:", chat.userName);
                    }}
                  />
                  <S.ChatInfo>
                    <S.ChatUserName>{chat.userName}</S.ChatUserName>
                  </S.ChatInfo>
                  {chat.unreadCount > 0 && (
                    <S.UnreadBadge>{chat.unreadCount}</S.UnreadBadge>
                  )}
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
                <S.ChatRoomHeaderLeft>
                  <S.ChatRoomProfile
                    src={getImageUrl(selectedChat.userProfile)}
                    alt={selectedChat.userName}
                    onError={(e) => {
                      e.target.src = "/assets/profile-icon.svg";
                    }}
                  />
                  <S.ChatRoomUserName>{selectedChat.userName}</S.ChatRoomUserName>
                </S.ChatRoomHeaderLeft>
                <S.LeaveChatButton onClick={handleLeaveChat}>
                  나가기
                </S.LeaveChatButton>
              </S.ChatRoomHeader>

              <S.MessageList ref={messageListRef}>
                {messages.length > 0 && messages.map((msg, index) => {
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
                            src={getImageUrl(selectedChat.userProfile) || "/assets/profile-icon.svg"}
                            alt={selectedChat.userName}
                            onError={(e) => {
                              e.target.src = "/assets/profile-icon.svg";
                            }}
                          />
                        </S.ProfileWrapper>
                      )}

                      <S.MessageBubble $isMine={isMine}>
                        {renderMessageWithLinks(msg.content)}
                      </S.MessageBubble>
                    </S.MessageRow>
                  );
                })}
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
