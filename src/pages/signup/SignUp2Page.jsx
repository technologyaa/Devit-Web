import * as S from "./styles/signUp2Page";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp2Page() {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const back = () => {
    navigate("/signup/1");
  };

  const home = () => {
    navigate("/home");
  };

  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="/assets/devit-logo(Di).svg" />
      </Helmet>

      <S.Container>
        <S.LoginWrapper>
          <S.LoginWrapperTopOfTop>
            <S.LoginWrapperTop>
              <S.DevitLogo src="/assets/devit-logo.svg" alt="Devit Logo" />
              <S.DevitText>개발자와 기획자를 이어주는 플랫폼</S.DevitText>
              <S.DevitBottom>
                <S.ReturnButton onClick={back}>
                  <S.ReturnImg
                    src="/assets/return-icon.svg"
                    alt="돌아가기 버튼"
                  ></S.ReturnImg>
                </S.ReturnButton>
                <S.DevitBottomText>2/2</S.DevitBottomText>
              </S.DevitBottom>
            </S.LoginWrapperTop>

            <S.LoginWrapperMiddle>
              <S.EmailInputWrapper>
                <S.EmailLabel>이메일</S.EmailLabel>
                <S.EmailInputContainer>
                  <S.EmailInput
                    type="email"
                    placeholder="예: example@email.com"
                  />
                  <S.SendCodeButton type="button">
                    인증번호 전송
                  </S.SendCodeButton>
                </S.EmailInputContainer>
              </S.EmailInputWrapper>

              <S.CodeInputWrapper>
                <S.CodeLabel>인증번호</S.CodeLabel>
                <S.CodeInput type="text" placeholder="6자리 숫자 입력" />
              </S.CodeInputWrapper>

              <S.RoleSelectWrapper>
                <S.RoleLabel>내 역할</S.RoleLabel>
                <S.RoleButtons>
                  {["개발자", "의뢰자", "TBD"].map((role) => (
                    <S.RoleButton
                      key={role}
                      type="button"
                      selected={selectedRole === role}
                      onClick={() => setSelectedRole(role)}
                    >
                      {role}
                    </S.RoleButton>
                  ))}
                </S.RoleButtons>
              </S.RoleSelectWrapper>
            </S.LoginWrapperMiddle>
          </S.LoginWrapperTopOfTop>

          <S.LoginWrapperBottom>
            <S.SigninButton onClick={home}>회원가입</S.SigninButton>
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
