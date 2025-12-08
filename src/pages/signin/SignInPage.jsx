import React, { useEffect, useState } from "react";
import * as S from "./styles/signInPage";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { Alarm } from "@/toasts/Alarm";
import { Toaster } from "react-hot-toast";
import { API_URL } from "@/constants/api";

export default function SignInPage() {

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const eyeOpen = "/assets/eye-open.svg";
  const eyeClosed = "/assets/eye-close.svg";

  const signIn = () => {
    navigate("/home");
    Alarm("🚪", "로그인 되었습니다.", "#4CAF50", "#E8F5E9");
  };

  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="./assets/Helmet.svg"></link>
      </Helmet>
      <S.Container>
        <S.LoginWrapper>
          <S.TopOfTop>
            <S.Top>
              <S.DevitLogo src="/assets/devit-logo.svg" alt="logo" />
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
                  onClick={() => Alarm("🛠️", "아직 개발중인 기능입니다.")}
                >
                  비밀번호 찾기
                </S.LosePsLink>
              </S.LosePsWrapper>
            </S.Middle>
          </S.TopOfTop>

          <S.Bottom>
            <S.BottomTop>
              <S.LoginButton onClick={signIn}>로그인</S.LoginButton>
              <S.OrText>또는</S.OrText>
              <S.GoogleLoginButton>
                <S.GoogleLogo src="/assets/google-logo.svg" alt="구글 로그인" />
                <S.GoogleLoginText>구글로 로그인</S.GoogleLoginText>
              </S.GoogleLoginButton>
            </S.BottomTop>
            <S.NoAccWrapper>
              <S.NoAccLabel>계정이 없으신가요?</S.NoAccLabel>
              <Link to="/signup">
                <S.NoAccLink>회원가입</S.NoAccLink>
              </Link>
            </S.NoAccWrapper>
          </S.Bottom>
        </S.LoginWrapper>

        <S.BackgroundCircle1 />
        <S.BackgroundCircle2 />
        <S.BackgroundCircle3 />
        <S.BackgroundCircle4 />
        <Toaster position="top-right" />
      </S.Container>
    </>
  );
}
