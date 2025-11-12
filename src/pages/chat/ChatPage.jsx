import { useState, useRef, useEffect } from "react";
import * as S from "./styles/chatPage";
import { Helmet } from "react-helmet";
import { chatList as initialChatList } from "@/data/chat-list";

export default function ChatPage() {
  // ChatPage.jsx 안의 이 부분 수정

  const [chatList, setChatList] = useState(() => {
    const saved = localStorage.getItem("chatList");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 🔹 메시지가 하나라도 있는 경우에만 localStorage 데이터 사용
        const hasMessages = parsed.some(
          (chat) => chat.messages && chat.messages.length > 0
        );
        if (hasMessages) return parsed;
      } catch {
        console.warn("⚠️ localStorage 데이터 파싱 실패, 기본값 사용");
      }
    }
    return initialChatList;
  });

  const [selectedChat, setSelectedChat] = useState(() => {
    const saved = localStorage.getItem("selectedChatId");
    const savedList = localStorage.getItem("chatList");
    if (saved && savedList) {
      const parsed = JSON.parse(savedList);
      return parsed.find((chat) => chat.id === Number(saved)) || parsed[0];
    }
    return initialChatList[0];
  });

  const [messageInput, setMessageInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const isSending = useRef(false);
  const messageListRef = useRef(null);

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

  // ✅ 메시지 전송
  const handleSend = () => {
    if (isSending.current || isComposing) return;
    if (!messageInput.trim()) return;

    isSending.current = true;
    const newMessage = {
      id: selectedChat.messages.length + 1,
      sender: "나",
      content: messageInput,
      time: new Date().toISOString(),
      isMine: true,
    };

    const updatedChat = {
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
    };

    const updatedChatList = chatList.map((chat) =>
      chat.id === updatedChat.id ? updatedChat : chat
    );

    setChatList(updatedChatList);
    setSelectedChat(updatedChat);
    setMessageInput("");

    // ✅ localStorage에 저장
    localStorage.setItem("chatList", JSON.stringify(updatedChatList));

    setTimeout(() => {
      isSending.current = false;
    }, 100);
  };

  // ✅ 선택된 채팅방 ID 저장 (새로고침 후 유지)
  useEffect(() => {
    if (selectedChat) {
      localStorage.setItem("selectedChatId", selectedChat.id);
    }
  }, [selectedChat]);

  // ✅ 메시지 추가 시 자동 스크롤
  useEffect(() => {
    const el = messageListRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [selectedChat.messages]);

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
            {chatList.map((chat) => (
              <S.ChatItem
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                isActive={selectedChat.id === chat.id}
              >
                <S.ChatProfile
                  src={chat.userProfile || "/assets/default-profile.svg"}
                  alt={chat.userName}
                />
                <S.ChatInfo>
                  <S.ChatUserName>{chat.userName}</S.ChatUserName>
                  <S.ChatLastMessage>
                    {chat.messages[chat.messages.length - 1]?.content ||
                      chat.lastMessage}
                  </S.ChatLastMessage>
                </S.ChatInfo>
              </S.ChatItem>
            ))}
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
                {selectedChat.messages.map((msg, index) => {
                  const isMine = msg.isMine;
                  const nextMsg = selectedChat.messages[index + 1];
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
