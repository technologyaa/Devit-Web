import { useState, useRef, useEffect } from "react";
import * as S from "./styles/chatPage";
import { Helmet } from "react-helmet";
import { chatList as initialChatList } from "@/data/chat-list";

export default function ChatPage() {
  const [chatList, setChatList] = useState(initialChatList);
  const [selectedChat, setSelectedChat] = useState(initialChatList[0]);
  const [messageInput, setMessageInput] = useState("");
  const [isComposing, setIsComposing] = useState(false); // 👈 한글 조합 중 여부
  const isSending = useRef(false);
  const messageListRef = useRef(null);

  const handleSend = () => {
    if (isSending.current || isComposing) return; // 👈 조합 중이면 return
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

    setChatList((prev) =>
      prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
    );
    setSelectedChat(updatedChat);
    setMessageInput("");

    setTimeout(() => {
      isSending.current = false;
    }, 100);
  };

  // ✅ 자동 스크롤
  useEffect(() => {
    const el = messageListRef.current;
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    }
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
                style={{
                  backgroundColor:
                    selectedChat.id === chat.id ? "#f3f0ff" : "transparent",
                }}
              >
                <S.ChatProfile
                  src={chat.userProfile || "/assets/default-profile.svg"}
                  alt={chat.userName}
                />
                <S.ChatInfo>
                  <S.ChatUserName>{chat.userName}</S.ChatUserName>
                  <S.ChatLastMessage>{chat.lastMessage}</S.ChatLastMessage>
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
