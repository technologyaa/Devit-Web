import { useState } from "react";
import axios from "axios"; // ★ axios import 필수
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

  const handleFinalSubmit = async () => {
    try {
      console.log('최종 전송 데이터:', formData);

      // 2. 대소문자 주의: formData (소문자)
      const response = await axios.post(`${API_URL}/auth/signup`, formData);

      if (response.status === 200 || response.status === 201) {
        alert('회원가입 성공!');
        // navigate('/login'); // 페이지 이동이 필요하면 추가
      }
    } catch (error) {
      console.error(error);
      alert('가입 실패..');
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
          onChange={handleInputChange}
          onSubmit={handleFinalSubmit} 
        />
      )}
      
      {/* 디버깅용 로그 (나중에 삭제) */}
      {console.log("현재 데이터:", formData)}
      
      <Toaster position="top-right" />
    </>
  );
}