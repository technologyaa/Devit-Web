import * as S from "./styles/chatPage";
import { Helmet } from "react-helmet";

export default function ChatPage() {
  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="./assets/Helmet.svg"></link>
      </Helmet>
      <S.Container>
        <S.ChatList>
          <S.ChatListHeader>채팅</S.ChatListHeader>
          <S.ChatItemList>
            <S.ChatItem> ... </S.ChatItem>
            <S.ChatItem> ... </S.ChatItem>
            <S.ChatItem> ... </S.ChatItem>
          </S.ChatItemList>
        </S.ChatList>
        <S.ChatRoom></S.ChatRoom>
      </S.Container>
    </>
  );
}
