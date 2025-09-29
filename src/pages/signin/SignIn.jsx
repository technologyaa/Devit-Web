import React, { useState } from "react";
import * as S from "./styles/signIn";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  const eyeOpen = "/assets/eye-open.png";
  const eyeClosed = "/assets/eye-close.png";

  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="/assets/devit-logo(Di).png"></link>
      </Helmet>
      <S.Container>
        <S.LoginWrapper>
          <S.TopOfTop>
            <S.Top>
              <S.DevitLogo src="/assets/devit-logo.png" alt="logo" />
              <S.DevitText>개발자와 기획자를 이어주는 플랫폼</S.DevitText>
            </S.Top>
            <S.Middle>
              <S.MiddleTop>
                <S.InputWrapper>
                  <S.Label>아이디</S.Label>
                  <S.Input placeholder="아이디를 입력하세요." type="text" />
                </S.InputWrapper>
                <S.InputWrapper>
                  <S.Label>비밀번호</S.Label>
                  <S.PsInputContainer>
                    <S.Input
                      placeholder="비밀번호를 입력하세요."
                      type={showPassword ? "text" : "password"}
                    />
                    <S.EyeIcon
                      src={showPassword ? eyeClosed : eyeOpen}
                      alt="비밀번호 보기"
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  </S.PsInputContainer>
                </S.InputWrapper>
              </S.MiddleTop>

              <S.LosePsWrapper>
                <S.LosePsLabel>비밀번호를 잊어버리셨나요?</S.LosePsLabel>
                <S.LosePsLink
                  onClick={() => {
                    alert("아직 개발 중입니다.");
                  }}
                >
                  비밀번호 찾기
                </S.LosePsLink>
              </S.LosePsWrapper>
            </S.Middle>
          </S.TopOfTop>

          <S.Bottom>
            <S.BottomTop>
              <S.LoginButton>로그인</S.LoginButton>
              <S.OrText>또는</S.OrText>
              <S.GoogleLoginButton>
                <S.GoogleLogo src="/assets/google-logo.png" alt="구글 로그인" />
                <S.GoogleLoginText>구글로 로그인</S.GoogleLoginText>
              </S.GoogleLoginButton>
            </S.BottomTop>
            <S.NoAccWrapper>
              <S.NoAccLabel>계정이 없으신가요?</S.NoAccLabel>
              <Link to="/signup/1">
                <S.NoAccLink>회원가입</S.NoAccLink>
              </Link>
            </S.NoAccWrapper>
          </S.Bottom>
        </S.LoginWrapper>

        <S.BackgroundCircle1 />
        <S.BackgroundCircle2 />
        <S.BackgroundCircle3 />
        <S.BackgroundCircle4 />
      </S.Container>
    </>
  );
}
