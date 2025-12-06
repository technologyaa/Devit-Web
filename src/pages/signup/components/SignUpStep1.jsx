import * as S from "../styles/signUpStep1";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Alarm } from "@/toasts/Alarm";

export default function SignUpStep1({ data, onChange, onNext }) {
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleNext = (e) => {
    // 폼 submit로 들어올 경우 새로고침 방지
    if (e) e.preventDefault();

    // 부모가 준 data 주머니에서 username(아이디)과 password를 꺼냅니다.
    const { username: id, password } = data; 

    if (!id || !password || !passwordConfirm) {
      Alarm("‼️", "모든 항목을 입력해주세요.", "#FF1E1E", "#FFEAEA");
      return;
    }

    // 2) 아이디 형식 검사
    const idRegex = /^[A-Za-z0-9]+$/;
    if (!idRegex.test(id)) {
      Alarm(
        "‼️",
        "아이디는 영문/숫자만 입력 가능합니다.",
        "#FF1E1E",
        "#FFEAEA"
      );
      return;
    }

    // 3) 비밀번호 확인
    if (password !== passwordConfirm) {
      Alarm("‼️", "비밀번호가 일치하지 않습니다.", "#FF1E1E", "#FFEAEA");
      return;
    }

    if (password.length <= 7){
      Alarm("‼️", "비밀번호가 8자리 미만입니다.", "#FF1E1E", "#FFEAEA");
      return;
    }

    if (password)

    // 모든 조건 통과 → 다음 단계 이동
    onNext();
  };

  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="./assets/Helmet.svg" />
      </Helmet>

      <S.Container>
        {/* 엔터 입력 때문에 submit 발생할 수 있으니 onSubmit 적용 */}
        <S.LoginWrapper onSubmit={handleNext}>
          <S.TopOfTop>
            <S.TopSection>
              <S.Logo src="/assets/devit-logo.svg" alt="Devit Logo" />
              <S.DevitText>개발자와 기획자를 이어주는 플랫폼</S.DevitText>
              <S.DevitBottomText>1/2</S.DevitBottomText>
            </S.TopSection>

            <S.MiddleSection>
              <S.MiddleTop>
                {/* ID Input */}
                <S.InputWrapper>
                  <S.Label>아이디</S.Label>
                  <S.Input
                    placeholder="영문/숫자만 입력하세요."
                    type="text"
                    name="username"        // 중요: 부모 State 키값과 일치시켜야 함
                    value={data.username}  // 부모 데이터 사용
                    onChange={onChange}    // 부모 함수 사용
                  />
                </S.InputWrapper>

                {/* Password Input */}
                <S.InputWrapper>
                  <S.Label>비밀번호</S.Label>
                  <S.InputContainer>
                    <S.Input
                      placeholder="8자 이상 입력하세요."
                      type="password"
                      name="password"       // 중요: 부모 State 키값과 일치
                      value={data.password} // 부모 데이터 사용
                      onChange={onChange}   // 부모 함수 사용
                    />
                  </S.InputContainer>
                </S.InputWrapper>

                {/* Password Confirm Input */}
                <S.InputWrapper>
                  <S.Label>비밀번호 확인</S.Label>
                  <S.InputContainer>
                    <S.Input
                      placeholder="비밀번호를 입력하세요."
                      type="password"
                      // 얘는 여기서만 쓰니까 그냥 로컬 state 사용
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                  </S.InputContainer>
                </S.InputWrapper>
              </S.MiddleTop>
            </S.MiddleSection>
          </S.TopOfTop>

          <S.BottomSection>
            <S.NextButton>다음</S.NextButton>

            <S.NoAccWrapper>
              <S.YesAccLabel>계정이 있으신가요?</S.YesAccLabel>
              <Link to="/signin">
                <S.YesAccLink>로그인</S.YesAccLink>
              </Link>
            </S.NoAccWrapper>
          </S.BottomSection>
        </S.LoginWrapper>

        {/* 배경 요소 */}
        <S.BackgroundCircle1 />
        <S.BackgroundCircle2 />
        <S.BackgroundCircle3 />
        <S.BackgroundCircle4 />
      </S.Container>
    </>
  );
}
