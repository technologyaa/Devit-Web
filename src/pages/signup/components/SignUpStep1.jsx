import * as S from "../styles/signUp1Page";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function SignUpStep1({ goNext }) {
  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="./assets/Helmet.svg" />
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
                {/* 아이디 */}
                <S.InputWrapper>
                  <S.Label>아이디</S.Label>
                  <S.Input placeholder="영문/숫자만 입력하세요." type="text" />
                </S.InputWrapper>

                {/* 비밀번호 */}
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

                {/* 비밀번호 확인 */}
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
            <S.NextButton onClick={goNext}>다음</S.NextButton>

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
