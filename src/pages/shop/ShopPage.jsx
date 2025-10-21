import * as S from "./styles/shopPage";
import { Helmet } from "react-helmet";

export default function ShopPage() {
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
