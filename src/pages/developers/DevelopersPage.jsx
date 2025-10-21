import * as S from "./styles/developersPage";
import { Helmet } from "react-helmet";

export default function DevelopersPage() {
  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="/assets/devit-logo(Di).png"></link>
      </Helmet>
      <S.Container>
        <S.Wrapper></S.Wrapper>
      </S.Container>
    </>
  );
}
