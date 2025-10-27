import styled from "styled-components";
import { Image } from "@/styles/Image";

export const Container = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
`;

export const Frame = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

export const Top = styled.div`
  font-size: 26px;
  font-weight: 500;
  color: #111;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const Bottom = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

export const Box = styled.div`
  width: 260px;
  height: 200px;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  cursor: pointer;
  gap: 4px;
`;

export const Thumbnail = styled(Image)`
  width: 100%;
  height: 160px;
  border-radius: 18px;
  object-fit: cover;
`;

export const BoxBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #000;
`;

export const Owner = styled.div`
  font-size: 16px;
  color: #000;
`;

export const PlusButton = styled(Image)`
  width: 20px;
  cursor: pointer;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 420px;
  height: 260px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
`;

export const ModalTitle = styled.div`
  font-size: 22px;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 84%;
  height: 44px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  outline: none;
`;

export const ButtonGroup = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-between;
`;

export const CancelButton = styled.button`
  background: #eee;
  border: none;
  border-radius: 6px;
  width: 48%;
  height: 40px;
  cursor: pointer;
  &:hover {
    background: #ddd;
  }
`;

export const CreateButton = styled.button`
  background: #eee;
  border: none;
  border-radius: 6px;
  width: 48%;
  height: 40px;
  cursor: pointer;
  &:hover {
    background: #ddd;
  }
`;
