import * as S from "./styles/chatPage";
import { Helmet } from "react-helmet";

export default function ChatPage() {
  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="/assets/devit-logo(Di).png"></link>
      </Helmet>
      <S.Container>
        <S.Frame></S.Frame>
      </S.Container>
    </>
  );
}
