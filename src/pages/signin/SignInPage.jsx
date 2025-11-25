import React, { useState } from "react";
import * as S from "./styles/signInPage";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { Alarm } from "@/toasts/Alarm";
import { Toaster } from "react-hot-toast";
import { API_URL } from "@/constants/api";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const signIn = async () => {
    if (!username || !password) {
      return Alarm("⚠️", "아이디와 비밀번호를 모두 입력해주세요.");
    }

    try {
      const res = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!res.ok) {
        return Alarm(
          "❌",
          "아이디 또는 비밀번호가 올바르지 않습니다.",
          "#E57373",
          "#FFEBEE"
        );
      }

      const data = await res.json();

      // data.token 또는 data.accessToken 등 백엔드 스웨거에서 전달되는 키 확인 필요
      const token = data.token || data.accessToken;

      if (!token) {
        return Alarm("❌", "토큰이 없습니다. 백엔드를 확인하세요.");
      }

      localStorage.setItem("token", token);

      Alarm("🚪", "로그인 되었습니다!", "#4CAF50", "#E8F5E9");
      navigate("/home");
    } catch (error) {
      console.error(error);
      Alarm("❌", "서버 연결에 실패했습니다.");
    }
  };

  const eyeOpen = "/assets/eye-open.svg";
  const eyeClosed = "/assets/eye-close.svg";

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
                  <S.Input
                    placeholder="아이디를 입력하세요."
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </S.InputWrapper>
                <S.InputWrapper>
                  <S.Label>비밀번호</S.Label>
                  <S.PsInputContainer>
                    <S.Input
                      placeholder="비밀번호를 입력하세요."
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
