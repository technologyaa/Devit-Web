import * as S from "./styles/home";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function SignUp1() {
  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="/assets/devit-logo(Di).png"></link>
      </Helmet>
      <S.Container></S.Container>
    </>
  );
}
