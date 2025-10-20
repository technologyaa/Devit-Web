import { Image } from "@/styles/Image";
import styled from "styled-components";

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LoginWrapper = styled.form`
  width: 408px;
  height: 550px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  justify-content: center;
`;

export const TopOfTop = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TopSection = styled.div`
  width: 100%;
  height: 130px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

export const Logo = styled(Image)`
  width: 160px;
  height: auto;
`;

export const DevitText = styled.div`
  color: #3c2097;
  font-size: 18px;
  font-weight: 500;
`;

export const DevitBottomText = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

export const MiddleSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const MiddleTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const InputWrapper = styled.div`
  width: 100%;
  height: 78px;
  display: flex;
  gap: 4px;
  flex-direction: column;
`;

export const Label = styled.div`
  width: 100%;
  font-size: 16px;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  height: 54px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding-left: 8px;
  padding-right: 40px;
  box-sizing: border-box;
  outline: none;
  font-size: 15px;

  &::placeholder {
    color: #aaa;
  }
`;

export const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const PsIcon = styled(Image)`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  cursor: pointer;
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
`;

export const BottomSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const NextButton = styled.button`
  width: 100%;
  height: 52px;
  border-radius: 8px;
  background-color: #883cbe;
  font-size: 18px;
  color: white;
  outline: none;
  border: none;

  &:hover {
    background-color: #7b35ad;
    cursor: pointer;
  }
`;

export const NoAccWrapper = styled.div`
  width: 100%;
  height: 78px;
  display: flex;
  justify-content: center;
  gap: 4px;
  font-size: 14px;
`;

export const YesAccLabel = styled.div`
  color: #666666;
`;

export const YesAccLink = styled.a`
  color: #ab66dd;
  text-decoration: none;
`;

export const BackgroundCircle = styled.div`
  position: fixed;
  border-radius: 100%;
  ${({ $position }) => $position}
`;

export const BackgroundCircle1 = styled.div`
  position: fixed;
  left: -180px;
  bottom: -300px;
  background-color: rgba(136, 60, 190, 0.4);
  width: 460px;
  height: 460px;
  border-radius: 100%;
`;

export const BackgroundCircle2 = styled.div`
  position: fixed;
  left: 10px;
  bottom: -320px;
  background-color: rgba(171, 102, 221, 0.7);
  width: 400px;
  height: 400px;
  border-radius: 100%;
`;

export const BackgroundCircle3 = styled.div`
  position: fixed;
  right: -180px;
  bottom: -300px;
  background-color: rgba(136, 60, 190, 0.4);
  width: 460px;
  height: 460px;
  border-radius: 100%;
`;

export const BackgroundCircle4 = styled.div`
  position: fixed;
  right: 10px;
  bottom: -320px;
  background-color: rgba(171, 102, 221, 0.7);
  width: 400px;
  height: 400px;
  border-radius: 100%;
`;
