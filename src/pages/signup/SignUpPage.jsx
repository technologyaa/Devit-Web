import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SignUpStep1 from "./components/SignUpStep1";
import SignUpStep2 from "./components/SignUpStep2";
import { Toaster } from "react-hot-toast";
import { API_URL } from "@/constants/api";

export default function SignUpPage() {

  // 1. 변수명 소문자 formData로 변경 (권장)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "ROLE_DEVELOPER" // 기본값 설정해두면 좋음
  });

  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // 기존 값 유지하면서 업데이트
    setFormData({ ...formData, [name]: value });
  };

  const handleNextStep = () => {
    // Step 1에서 검증을 다 하고 넘어오므로 여기선 그냥 넘겨주면 됨
    setStep(2);
  };

  const handleBackStep = () => {
    setStep(1);
  }

  const handleFinalSubmit = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        role: formData.role,
      })
      if (response.status === 200 || response.status === 201) {
        navigate("/signin", {
          state: {
            message: "회원가입이 완료되었습니다. 로그인 해주세요!",
            success: true
          }
        })
      }
    } catch (error) {
      if (error.response) {
        // 서버가 응답을 줬으나 상태 코드가 2xx가 아닌 경우 (예: 400, 409, 500)
        alert(`가입 실패: ${error.response.data.message || '알 수 없는 오류'}`);
      } else if (error.request) {
        // 요청은 보냈으나 응답을 받지 못한 경우 (네트워크 문제 등)
        alert('서버와 통신할 수 없습니다.');
      } else {
        alert('요청 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <>
      {step === 1 && (
        <SignUpStep1
          data={formData}          // 소문자 formData
          onChange={handleInputChange}
          onNext={handleNextStep}
        />
      )}

      {step === 2 && (
        <SignUpStep2
          data={formData}          // 소문자 formData
          onBack={handleBackStep}
          onChange={handleInputChange}
          onSubmit={handleFinalSubmit}
        />
      )}

      <Toaster position="top-right" />
    </>
  );
}