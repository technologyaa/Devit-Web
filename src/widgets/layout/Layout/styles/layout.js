import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: ${(props) =>
    props.isChatPage
      ? "80px 1fr"
      : "240px 1fr"}; // 사이드바 접힘 여부에 따라 변경
`;
