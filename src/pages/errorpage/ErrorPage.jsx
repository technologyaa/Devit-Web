import * as S from "./styles/errorPage";
import { Helmet } from "react-helmet";
import devlopers from "@/data/developer-list";
import icons from "@/data/icon-list";
import { Link } from "react-router";

const gradients = {};

export default function ErrorPage() {
  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="/assets/devit-logo(Di).png"></link>
      </Helmet>
      <h1>없는 페이지입니다.</h1>
    </>
  );
}
