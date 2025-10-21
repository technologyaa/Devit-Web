import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

export const Frame = styled.div`
  width: 88%;
  height: 93%;
  display: flex;
  flex-direction: column;
  gap: 55px;
`;

export const Topmiddlewrap = styled.div``;

export const Top = styled.div`
  width: 100%;
  height: 160px;
  position: relative;
  overflow: hidden;
`;

export const Middle = styled.div`
  width: 100%;
  height: 170px;
  background-color: gray;
`;

export const Bottom = styled.div`
  width: 100%;
  height: 320px;
  background-color: green;
`;

export const Name = styled.div`
  font-size: 50px;
  font-weight: 600;
  position: absolute;
  top: 30px;
`;

export const Cricle1 = styled.div`
  position: absolute;
  top: -145px;
  right: 50px;
  background-color: rgba(171, 102, 221, 0.7);
  width: 250px;
  height: 250px;
  border-radius: 100%;
`;

export const Cricle2 = styled.div`
  position: absolute;
  top: -200px;
  right: -130px;
  background-color: rgba(136, 60, 190, 0.4);
  width: 340px;
  height: 340px;
  border-radius: 100%;
`;
