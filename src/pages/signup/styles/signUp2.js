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
  gap: 40px;
  justify-content: center;
`;

export const LoginWrapperTopOfTop = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const LoginWrapperTop = styled.div`
  width: 100%;
  height: 130px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

export const DevitLogo = styled.img`
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

export const LoginWrapperMiddle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const EmailInputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const EmailLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

export const EmailInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const EmailInput = styled.input`
  height: 54px;
  width: 74%;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding-left: 8px;
  font-size: 15px;
  outline: none;
`;

export const SendCodeButton = styled.button`
  height: 46px;
  width: 21%;
  background-color: #883cbe;
  color: white;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background-color: #7b35ad;
  }
`;

export const CodeInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const CodeLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

export const CodeInput = styled.input`
  height: 54px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding-left: 8px;
  font-size: 15px;
  outline: none;
`;

export const RoleSelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const RoleLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

export const RoleButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
`;

export const RoleButton = styled.button`
  flex: 1;
  height: 48px;
  border: ${(props) => (props.selected ? "none" : "1px solid #ccc")};
  border-radius: 8px;
  background-color: ${(props) => (props.selected ? "#883cbe" : "white")};
  color: ${(props) => (props.selected ? "white" : "#883cbe")};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.selected ? "#883cbe" : "#f5f5f5")};
  }
`;

export const LoginWrapperBottom = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const SigninButton = styled.button`
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
