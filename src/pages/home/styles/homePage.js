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
  gap: 30px;
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
  height: 250px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const Card = styled.div`
  height: 82%;
  background: ${props => props.gradient};
  border-radius: 22px;
  position: relative;
`;

export const Goto = styled.div`
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

export const Bottom = styled.div`
  width: 100%;
  height: 250px;
  
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



export const Gocontainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 30px 20px;

`;
export const Iconbutton = styled.div`
display: flex;
justify-content: space-between;
`;

export const RecommendDev = styled.div`
`;

export const Icon = styled.img`
  width: 2.75rem;
  height: 2.75rem;
  aspect-ratio: 1/1;
`;

export const Button = styled.div`
  background-color: #BF79FF;
  width: 90px;
  height: 30px;
  display: flex;
  justify-content:center;
  align-items: center;
  border-radius: 24px;
  color: white;
`;