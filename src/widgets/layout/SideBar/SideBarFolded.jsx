import * as S from "./styles/sideBarFolded";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Alarm } from "@/toasts/Alarm";
import Cookies from "js-cookie";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { API_URL } from "@/constants/api";

const menu = [
  { url: "/home", logo: "/assets/home-icon.svg", alt: "홈 아이콘" },
  { url: "/projects", logo: "/assets/folder-icon.svg", alt: "프로젝트 아이콘" },
  { url: "/chat", logo: "/assets/chat-icon.svg", alt: "채팅 아이콘" },
  { url: "/offer/dev", logo: "/assets/dev-icon.svg", alt: "개발자 아이콘" },
  { url: "/shop", logo: "/assets/shop-icon.svg", alt: "상점 아이콘" },
  { url: "/profile", logo: "/assets/profile-icon.svg", alt: "프로필 아이콘" },
];

export default function SideBarFolded() {
  const navigate = useNavigate();
  const location = useLocation();
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

      let rooms = [];
      if (Array.isArray(response.data)) {
        rooms = response.data;
      } else if (response.data?.data) {
        rooms = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (response.data?.rooms) {
        rooms = Array.isArray(response.data.rooms) ? response.data.rooms : [];
      }

      // 전체 읽지 않은 메시지 개수 합산
      const total = rooms.reduce((sum, room) => {
        const unreadCount = room.unreadCount || room.unreadMessageCount || 0;
        const count = Number(unreadCount);
        const validCount = isNaN(count) ? 0 : count;
        return sum + validCount;
      }, 0);
      setTotalUnreadCount(total);
    } catch (error) {
      setTotalUnreadCount(0);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // 주기적으로 업데이트 (5초마다)
    const interval = setInterval(fetchUnreadCount, 5000);
    
    // 채팅방 목록 업데이트 이벤트 리스너
    const handleChatUpdate = (event) => {
      if (event.detail && event.detail.totalUnreadCount !== undefined) {
        setTotalUnreadCount(event.detail.totalUnreadCount);
      } else {
        fetchUnreadCount();
      }
    };
    
    window.addEventListener('chatListUpdated', handleChatUpdate);
    
    return () => {
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

  return (
    <>
      <S.Container>
        <S.Top>
          <S.LogoBox>
            <Link to="/home">
              <S.DevitLogo src="/assets/DI-logo.svg" alt="로고" />
            </Link>
          </S.LogoBox>

          <S.Navigation>
            <S.NavigationWrapper>
              <S.NavigationTop>
                {menu.map((item) => (
                  <Link key={item.url} to={item.url}>
                    <S.MenuItem
                      selected={location.pathname.match(item.url)}
                      type="button"
                    >
                      <S.MenuIconWrapper>
                        <S.MenuIcon src={item.logo} alt={item.alt} />
                        {item.url === "/chat" && totalUnreadCount > 0 && (
                          <S.UnreadBadge 
                            title={`읽지 않은 메시지 ${totalUnreadCount}개`}
                          />
                        )}
                      </S.MenuIconWrapper>
                    </S.MenuItem>
                  </Link>
                ))}
              </S.NavigationTop>

              <S.NavigationBottom>
                <S.MenuItem onClick={moreClicked}>
                  <S.MenuIcon src="/assets/more-icon2.svg" alt="설정 아이콘" />
                </S.MenuItem>
                <Toaster position="top-right" />
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
