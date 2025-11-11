import { useState, useRef, useEffect } from "react";
import * as S from "./styles/chatPage";
import { Helmet } from "react-helmet";
import { chatList as initialChatList } from "@/data/chat-list";

export default function ChatPage() {
  // 💾 localStorage에 저장된 채팅이 있으면 불러오고, 없으면 초기값 사용
  const [chatList, setChatList] = useState(() => {
    const saved = localStorage.getItem("chatList");
    return saved ? JSON.parse(saved) : initialChatList;
  });

  const [selectedChat, setSelectedChat] = useState(
    chatList.find((c) => c.id === 1) || chatList[0]
  );
  const [messageInput, setMessageInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const isSending = useRef(false);
  const messageListRef = useRef(null);

  // 💬 메시지 전송 함수
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

    // 🔄 선택된 채팅 업데이트
    const updatedChat = {
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
    };

    // 🧩 chatList 상태 갱신
    const updatedChatList = chatList.map((chat) =>
      chat.id === updatedChat.id ? updatedChat : chat
    );

    // 🧠 마지막 메시지 정보 자동 반영
    const lastMsg = updatedChat.messages[updatedChat.messages.length - 1];
    updatedChat.lastMessage = lastMsg?.content || "";
    updatedChat.lastTime = lastMsg?.time || "";

    setChatList(updatedChatList);
    setSelectedChat(updatedChat);
    setMessageInput("");

    // 💾 localStorage 저장
    localStorage.setItem("chatList", JSON.stringify(updatedChatList));

    setTimeout(() => {
      isSending.current = false;
    }, 100);
  };

  // ✅ 자동 스크롤
  useEffect(() => {
    const el = messageListRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [selectedChat.messages]);

  // ✅ chatList 변경 시 localStorage 저장
  useEffect(() => {
    localStorage.setItem("chatList", JSON.stringify(chatList));
  }, [chatList]);

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
                isActive={selectedChat.id === chat.id} // ✅ props 전달
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
            ))}
          </S.ChatItemList>
        </S.ChatList>

        {/* 💭 오른쪽 채팅방 */}
        <S.ChatRoom>
          {selectedChat ? (
            <>
              <S.ChatRoomHeader>
                <S.ChatRoomProfile
                  src={
                    selectedChat.userProfile || "/assets/default-profile.svg"
                  }
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
                        {msg.content}
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
