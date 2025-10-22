import * as S from "./styles/taskDetailPage";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function TaskDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { task } = location.state || {};

  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="./assets/Helmet.svg" />
      </Helmet>

      <S.Container>
        <S.Frame>
          <S.Top>
            <S.TopWrapper>
              <S.BackIcon
                onClick={() => navigate(-1)}
                src="/assets/back-icon.svg"
              />
              <S.ProjectText>{task?.title}</S.ProjectText>
            </S.TopWrapper>
          </S.Top>
          <S.Bottom></S.Bottom>
        </S.Frame>
      </S.Container>
    </>
  );
}
