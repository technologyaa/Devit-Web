import * as S from "./styles";

export default function SideBar() {
  return (
    <S.Container>
      <S.Top>
        <S.LogoBox></S.LogoBox>
        <S.Navigation></S.Navigation>
      </S.Top>
      <S.Bottom>
        <S.Profile></S.Profile>
      </S.Bottom>
    </S.Container>
  );
}
