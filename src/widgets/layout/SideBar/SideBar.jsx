import * as S from "./styles/sideBar";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { Alarm } from "@/toasts/Alarm";
import Cookies from "js-cookie";
import axios from "axios";
import { API_URL } from "@/constants/api";

const menu = [
  {
    url: "/home",
    logo: "/assets/home-icon.svg",
    alt: "홈 아이콘",
    text: "홈",
  },
  {
    url: "/projects",
    logo: "/assets/folder-icon.svg",
    alt: "폴더 아이콘",
    text: "프로젝트",
  },
  {
    url: "/chat",
    logo: "/assets/chat-icon.svg",
    alt: "채팅 아이콘",
    text: "채팅",
  },
  {
    url: "/offer/dev",
    logo: "/assets/dev-icon.svg",
    alt: "개발자 아이콘",
    text: "개발자",
  },
  {
    url: "/shop",
    logo: "/assets/shop-icon.svg",
    alt: "상점 아이콘",
    text: "상점",
  },
  {
    url: "/profile",
    logo: "/assets/profile-icon.svg",
    alt: "프로필 아이콘",
    text: "프로필",
  },
];

export default function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  // 전체 읽지 않은 메시지 개수 가져오기
  const fetchUnreadCount = async () => {
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

      console.log("🔍 SideBar - API Response:", response.data);
      
      let rooms = [];
      if (Array.isArray(response.data)) {
        rooms = response.data;
        console.log("🔍 SideBar - Using direct array format");
      } else if (response.data?.data) {
        rooms = Array.isArray(response.data.data) ? response.data.data : [];
        console.log("🔍 SideBar - Using data.data format, rooms count:", rooms.length);
      } else if (response.data?.rooms) {
        rooms = Array.isArray(response.data.rooms) ? response.data.rooms : [];
        console.log("🔍 SideBar - Using data.rooms format, rooms count:", rooms.length);
      } else {
        console.warn("⚠️ SideBar - Unknown response format:", response.data);
      }
      
      console.log("🔍 SideBar - Parsed rooms:", rooms);
      if (rooms.length > 0) {
        console.log("🔍 SideBar - First room sample:", rooms[0]);
        console.log("🔍 SideBar - First room keys:", Object.keys(rooms[0]));
      }

      // 전체 읽지 않은 메시지 개수 합산 (ChatPage와 동일한 방식)
      const total = rooms.reduce((sum, room) => {
        // ChatPage에서 사용하는 방식과 동일: room.unreadCount || room.unreadMessageCount || 0
        const unreadCount = room.unreadCount || room.unreadMessageCount || 0;
        const count = Number(unreadCount);
        const validCount = isNaN(count) || count < 0 ? 0 : count;
        
        if (validCount > 0) {
          console.log("📋 Room with unread:", room.id, "unreadCount:", unreadCount, "parsed:", validCount);
        }
        
        return sum + validCount;
      }, 0);

      console.log("📊 Total unread count:", total, "from", rooms.length, "rooms");
      setTotalUnreadCount(total);
    } catch (error) {
      // 에러 발생 시 0으로 설정
      console.error("Failed to fetch unread count:", error);
      setTotalUnreadCount(0);
    }
  };

  useEffect(() => {
    // 즉시 실행
    console.log("🚀 SideBar - useEffect triggered, fetching unread count...");
    fetchUnreadCount();
    
    // 주기적으로 업데이트 (3초마다 - 더 빠른 업데이트)
    const interval = setInterval(() => {
      console.log("⏰ SideBar - Periodic update triggered");
      fetchUnreadCount();
    }, 3000);
    
    // 채팅방 목록 업데이트 이벤트 리스너
    const handleChatUpdate = (event) => {
      console.log("📨 SideBar - chatListUpdated event received:", event.detail);
      if (event.detail && event.detail.totalUnreadCount !== undefined) {
        console.log("📊 SideBar - Setting totalUnreadCount to:", event.detail.totalUnreadCount);
        setTotalUnreadCount(event.detail.totalUnreadCount);
      } else {
        console.log("📊 SideBar - Event detail missing, fetching manually");
        fetchUnreadCount();
      }
    };
    
    window.addEventListener('chatListUpdated', handleChatUpdate);
    
    return () => {
      console.log("🧹 SideBar - Cleanup: removing interval and event listener");
      clearInterval(interval);
      window.removeEventListener('chatListUpdated', handleChatUpdate);
    };
  }, []);

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    navigate("/signin");
    Alarm("🚪", "로그아웃 되었습니다.", "#FF1E1E", "#FFEAEA");
  };

  const moreClicked = () => setIsMoreOpen((prev) => !prev);

  // 디버깅: totalUnreadCount 값 확인
  console.log("🔍 SideBar - totalUnreadCount:", totalUnreadCount, "should show badge:", totalUnreadCount > 0);
  console.log("🔍 SideBar - typeof totalUnreadCount:", typeof totalUnreadCount);
  console.log("🔍 SideBar - totalUnreadCount > 0:", totalUnreadCount > 0);

  return (
    <>
      <S.Container>
        <S.Top>
          <S.LogoBox>
            <S.StyledLink to="/home">
              <S.DevitLogo
                src="/assets/devit-logo.svg"
                alt="logo image"
              ></S.DevitLogo>
            </S.StyledLink>
          </S.LogoBox>
          <S.Navigation>
            <S.NavigationWrapper>
              <S.NavigationTop>
                {menu.map((item) => (
                  <S.StyledLink key={item.url} to={item.url}>
                    <S.MenuItem
                      type="button"
                      selected={location.pathname.match(item.url)}
                    >
                      <S.MenuIcon src={item.logo} alt={item.alt} />
                      <S.MenuText>{item.text}</S.MenuText>
                      {item.url === "/chat" && totalUnreadCount > 0 && (
                        <S.UnreadBadge 
                          title={`읽지 않은 메시지 ${totalUnreadCount}개`}
                          data-testid="unread-badge"
                        />
                      )}
                    </S.MenuItem>
                  </S.StyledLink>
                ))}
              </S.NavigationTop>
              <S.NavigationBottom>
                <S.MenuItem onClick={moreClicked}>
                  <S.MenuIcon src="/assets/more-icon2.svg" alt="설정 아이콘" />
                  <Toaster position="top-right" />
                  <S.MenuText>더보기</S.MenuText>
                </S.MenuItem>
              </S.NavigationBottom>
            </S.NavigationWrapper>
          </S.Navigation>
        </S.Top>
      </S.Container>
      {isMoreOpen && (
        <S.MoreBox>
          <S.MoreItem>개인정보 처리 방침</S.MoreItem>
          <S.MoreItem style={{ color: "red" }} onClick={logout}>
            로그아웃
          </S.MoreItem>
        </S.MoreBox>
      )}
    </>
  );
}
