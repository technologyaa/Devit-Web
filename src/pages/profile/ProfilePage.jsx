import * as S from "./styles/profilePage";
import { Helmet } from "react-helmet";

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="./assets/Helmet.svg"></link>
      </Helmet>
      <S.Container>
        <S.Frame></S.Frame>
      </S.Container>
    </>
  );
}
