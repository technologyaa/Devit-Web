import * as S from "./styles/signUp1";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function SignUp1() {
  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="/assets/devit-logo(Di).svg"></link>
      </Helmet>
      <S.Container>
        <S.LoginWrapper>
          <S.TopOfTop>
            <S.TopSection>
              <S.Logo src="/assets/devit-logo.svg" alt="Devit Logo" />
              <S.DevitText>개발자와 기획자를 이어주는 플랫폼</S.DevitText>
              <S.DevitBottomText>1/2</S.DevitBottomText>
            </S.TopSection>

            <S.MiddleSection>
              <S.MiddleTop>
                <S.InputWrapper>
                  <S.Label>아이디</S.Label>
                  <S.Input placeholder="영문/숫자만 입력하세요." type="text" />
                </S.InputWrapper>

                <S.InputWrapper>
                  <S.Label>비밀번호</S.Label>
                  <S.InputContainer>
                    <S.Input
                      id="passwordInput"
                      placeholder="8자 이상 입력하세요."
                      type="password"
                    />
                  </S.InputContainer>
                </S.InputWrapper>

                <S.InputWrapper>
                  <S.Label>비밀번호 확인</S.Label>
                  <S.InputContainer>
                    <S.Input
                      id="passwordcInput"
                      placeholder="비밀번호를 입력하세요."
                      type="password"
                    />
                  </S.InputContainer>
                </S.InputWrapper>
              </S.MiddleTop>
            </S.MiddleSection>
          </S.TopOfTop>

          <S.BottomSection>
            <Link to="/signup/2" style={{ display: "block", width: "100%" }}>
              <S.NextButton>다음</S.NextButton>
            </Link>
            <S.NoAccWrapper>
              <S.YesAccLabel>계정이 있으신가요?</S.YesAccLabel>
              <Link to="/signin">
                <S.YesAccLink>로그인</S.YesAccLink>
              </Link>
            </S.NoAccWrapper>
          </S.BottomSection>
        </S.LoginWrapper>

        <S.BackgroundCircle1 />
        <S.BackgroundCircle2 />
        <S.BackgroundCircle3 />
        <S.BackgroundCircle4 />
      </S.Container>
    </>
  );
}
