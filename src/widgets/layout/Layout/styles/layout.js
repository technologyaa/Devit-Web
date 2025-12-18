import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: ${(props) =>
    props.$isChatPage
      ? "83.4px 1fr"
      : "240px 1fr"}; // 사이드바 접힘 여부에 따라 변경
`;

export const Content = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  /* scrollbar-gutter: stable both-edges; */
  padding: ${(props) => (props.$isChatPage ? "0" : "70px 80px")};
  box-sizing: border-box;
`;
