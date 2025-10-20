import * as S from "./styles/shopPage";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import SideBar from "@/widgets/layout/SideBar/SideBar";

export default function ShopPage() {
  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="/assets/devit-logo(Di).png"></link>
      </Helmet>
      <S.Container>
        <SideBar></SideBar>
      </S.Container>
    </>
  );
}
