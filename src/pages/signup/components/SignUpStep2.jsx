import * as S from "../styles/signUpStep2";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom"; // useNavigate 추가
import { Alarm } from "@/toasts/Alarm";
import axios from "axios";
import { API_URL } from "@/constants/api";
import { useState, useEffect } from "react";

export default function SignUpStep2({ data, onChange, onSubmit, onBack }) {

  const [inputCode, setInputCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);

  const ROLE_OPTIONS = [
    { label: "개발자", value: "ROLE_DEVELOPER" },
    { label: "의뢰인", value: "ROLE_USER" },
    { label: "TBD", value: "ROLE_TBD" },
  ];

  useEffect(() => {
    setIsVerified(false);
    setIsCodeSent(false);
    setTimeLeft(0);
    setInputCode("");
  }, [data.email]);

  useEffect(() => {
    if (timeLeft === 0) return; // 0이면 아무것도 안 함

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // 컴포넌트 언마운트되거나 timeLeft가 0이 되면 인터벌 정리
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  // [수정됨 2] 버튼 클릭 시 부모의 onChange를 '인위적으로' 호출하는 함수
  const handleRoleClick = (roleValue) => {
    // 부모는 e.target.name과 e.target.value를 찾으므로 모양을 맞춰서 보냄
    onChange({
      target: {
        name: "role",      // 바꿀 필드명
        value: roleValue,  // 바꿀 값 (예: ROLE_DEVELOPER)
      },
    });
  };

  const handleSendCode = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      Alarm("‼️", "올바른 이메일 형식이 아닙니다.", "#FF1E1E", "#FFEAEA")
      return;
    }
    try {
      await axios.post(`${API_URL}/email/send`, { email: data.email });
      Alarm("📨", "인증번호가 전송되어있습니다.", "#3CAF50", "#E8F5E9");
      setIsCodeSent(true); // useState 값 변경
      setTimeLeft(60);
    } catch (error) {
      console.error(error);
      Alarm("‼️", "인증번호 전송 실패. 다시 시도해주세요.", "#FF1E1E", "#FFEAEA")
    }
  }

  const handleVerifyCode = async () => {
    if (!inputCode) {
      Alarm("‼️", "인증번호를 입력해주세요.", "#FF1E1E", "#FFEAEA")
      return;
    }
    axios.post(`${API_URL}/email/check`, {
      email: data.email,
      authNum: inputCode
    })
      .then((response) => {
        if (response.status === 200) {
          Alarm("✅", "이메일 인증이 완료되었습니다!", "#4CAF50", "#E8F5E9");
          setIsVerified(true);
          setTimeLeft(0);
        }
      })
      .catch((error) => {
        Alarm("‼️", "인증번호가 일치하지 않습니다.", "#FF1E1E", "#FFEAEA");
        setIsVerified(false);
        console.log(error)
      })
  }


  // 최종제출
  const handleFinalSubmit = (e) => {
    e.preventDefault();

    if (!data.email || !data.role) {
      Alarm("‼️", "모든 항목을 입력해주세요.", "#FF1E1E", "#FFEAEA");
      return;
    }

    if (!isVerified) {
      Alarm("‼️", "이메일 인증을 완료해주세요.", "#FF1E1E", "#FFEAEA");
      return;
    }

    // 모든 검증 통과 시 부모의 API 요청 함수 실행
    onSubmit();
  };

  const getButtonText = () => {
    if (isVerified) return "인증완료";
    if (timeLeft > 0) return `${timeLeft}초 후 재전송`;
    if (isCodeSent) return "재전송";
    return "인증번호 전송";
  };

  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="./assets/Helmet.svg" />
      </Helmet>

      <S.Container>
        {/* onSubmit이 버튼 클릭 시 실행됨 */}
        <S.LoginWrapper onSubmit={handleFinalSubmit}>
          <S.LoginWrapperTopOfTop>
            <S.LoginWrapperTop>
              <S.DevitLogo src="/assets/devit-logo.svg" alt="Devit Logo" />
              <S.DevitText>개발자와 기획자를 이어주는 플랫폼</S.DevitText>

              <S.DevitBottom>
                <S.ReturnButton type="button" onClick={onBack}>
                  <S.ReturnImg
                    src="/assets/return-icon.svg"
                    alt="돌아가기 버튼"
                  />
                </S.ReturnButton>
                <S.DevitBottomText>2/2</S.DevitBottomText>
              </S.DevitBottom>
            </S.LoginWrapperTop>

            <S.LoginWrapperMiddle>
              {/* 이메일 입력 부분 */}
              <S.EmailInputWrapper>
                <S.EmailLabel>이메일</S.EmailLabel>
                <S.EmailInputContainer>
                  <S.EmailInput
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={onChange}
                    placeholder="example@devit.com"
                    readOnly={isVerified}
                    style={{ backgroundColor: isVerified ? "#f0f0f0" : "white" }}
                  />
                  <S.SendCodeButton
                    type="button"
                    onClick={handleSendCode}
                    disabled={isVerified || timeLeft > 0}
                  >
                    {getButtonText()}
                  </S.SendCodeButton>
                </S.EmailInputContainer>
              </S.EmailInputWrapper>

              <S.CodeInputWrapper>
                <S.CodeLabel>인증번호</S.CodeLabel>
                {/* 스타일 재활용: EmailInputContainer처럼 버튼을 옆에 붙임 */}
                <S.EmailInputContainer>
                  <S.EmailInput
                    type="text"
                    placeholder="6자리 숫자 입력"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    disabled={isVerified} // 인증 되면 입력 막음
                  />
                  <S.SendCodeButton
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={isVerified}
                    style={{ backgroundColor: isVerified ? "#ccc" : "#000" }} // 완료되면 회색 처리
                  >
                    확인
                  </S.SendCodeButton>
                </S.EmailInputContainer>
              </S.CodeInputWrapper>

              <S.RoleSelectWrapper>
                <S.RoleLabel>내 역할</S.RoleLabel>
                <S.RoleButtons>
                  {ROLE_OPTIONS.map((option) => (
                    <S.RoleButton
                      key={option.value}
                      type="button"
                      selected={data.role === option.value}
                      onClick={() => handleRoleClick(option.value)}
                    >
                      {option.label}
                    </S.RoleButton>
                  ))}
                </S.RoleButtons>
              </S.RoleSelectWrapper>
            </S.LoginWrapperMiddle>
          </S.LoginWrapperTopOfTop>

          <S.LoginWrapperBottom>
            {/* 여기 onClick={signUp}은 제거하고 type="submit"으로 폼 제출 유도 */}
            <S.SigninButton type="submit">회원가입</S.SigninButton>

            <S.NoAccWrapper>
              <S.YesAccLabel>계정이 있으신가요?</S.YesAccLabel>
              <Link to="/signin">
                <S.YesAccLink>로그인</S.YesAccLink>
              </Link>
            </S.NoAccWrapper>
          </S.LoginWrapperBottom>
        </S.LoginWrapper>

        <S.BackgroundCircle1 />
        <S.BackgroundCircle2 />
        <S.BackgroundCircle3 />
        <S.BackgroundCircle4 />
      </S.Container>
    </>
  );
}