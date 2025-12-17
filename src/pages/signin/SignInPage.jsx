import React, { useEffect, useState } from "react";
import * as S from "./styles/signInPage";
import { Helmet } from "react-helmet";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Alarm } from "@/toasts/Alarm";
import { Toaster } from "react-hot-toast";
import { API_URL } from "@/constants/api";
import Cookies from "js-cookie";
import axios from "axios";

export default function SignInPage() {

  const location = useLocation(); // 1. 넘어온 데이터를 받기 위한 훅

  useEffect(() => {
    if (location.state && location.state.success) {
      // 새로고침할때 다시 안뜨도록
      Alarm("✅", location.state.message, '#3CAF50', "#E8F5E9");
      window.history.replaceState({}, document.title);
    }
  }, [location])

  const [logInData, setLogInData] = useState({
    username: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // 기존 값 유지하면서 업데이트
    setLogInData({ ...logInData, [name]: value });
  };

  const eyeOpen = "/assets/eye-open.svg";
  const eyeClosed = "/assets/eye-close.svg";

  const { username: id, password } = logInData;
  const signIn = async (e) => {
    e.preventDefault();
    if (!id || !password) {
      Alarm("‼️", "모든 항목을 입력해주세요.", "#FF1E1E", "#FFEAEA")
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/auth/signin`, {
        username: id,
        password: password
      },
        {
          withCredentials: true
        })
      if (response.status === 200) {
        // Assuming the backend might return the token, or we just set a flag for the client-side router
        console.log("SignIn Response:", response.data);
        console.log("SignIn Headers:", response.headers);

        const responseData = response.data.data || response.data;
        const accessToken = responseData.accessToken || response.headers["authorization"];
        const refreshToken = responseData.refreshToken || response.headers["refresh-token"];

        if (accessToken) {
          Cookies.set("accessToken", accessToken);
          Cookies.set("refreshToken", refreshToken); // Might be undefined
        } else {
          console.warn("No access token found in response body or headers");
          // If we rely on HttpOnly cookies, we might not need to set anything here, 
          // BUT router.jsx checks Cookies.get("accessToken"). 
          // So if we don't set it, user can't access protected routes.
          // This implies backend MUST return it, or router.jsx logic is incompatible with HttpOnly.
        }
        navigate("/home")
        Alarm("✅", "로그인 완료!", "#3CAF50", "#E8F5E9")
      }
    } catch (error) {
      console.error(error);
      Alarm(
        "❌",
        <>
          로그인에 실패했습니다.
          <br />
          아이디와 비밀번호를 확인해주세요.
        </>,
        "#FF1E1E",
        "#FFEAEA"
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="./assets/Helmet.svg"></link>
      </Helmet>
      <S.Container>
        <S.LoginWrapper as="form" onSubmit={signIn}>
          <S.TopOfTop>
            <S.Top>
              <S.DevitLogo src="/assets/devit-logo.svg" alt="logo" />
              <S.DevitText>개발자와 기획자를 이어주는 플랫폼</S.DevitText>
            </S.Top>
            <S.Middle>
              <S.MiddleTop>
                <S.InputWrapper>
                  <S.Label>아이디</S.Label>
                  <S.Input placeholder="아이디를 입력하세요."
                    type="text"
                    name="username"
                    value={logInData.username}  // 부모 데이터 사용
                    onChange={handleInputChange}    // 부모 함수 사용
                  />
                </S.InputWrapper>
                <S.InputWrapper>
                  <S.Label>비밀번호</S.Label>
                  <S.PsInputContainer>
                    <S.Input
                      placeholder="비밀번호를 입력하세요."
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={logInData.password}  // 부모 데이터 사용
                      onChange={handleInputChange}    // 부모 함수 사용
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
