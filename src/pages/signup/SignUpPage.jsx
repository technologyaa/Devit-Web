import { useState } from "react";
import SignUpStep1 from "./components/SignUpStep1";
import SignUpStep2 from "./components/SignUpStep1";

export default function SignUpPage() {
  const [step, setStep] = useState(1);

  return (
    <>
      {step === 1 && <SignUpStep1 goNext={() => setStep(2)} />}
      {step === 2 && <SignUpStep2 goBack={() => setStep(1)} />}
    </>
  );
}
