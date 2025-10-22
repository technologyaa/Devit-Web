import * as S from "./styles/projectsDetailPage";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { projectList } from "./ProjectsPage";

export default function ProjectsDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const project = projectList.find((p) => p.id === Number(id));

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
              <S.ProjectText>{project?.title}</S.ProjectText>
            </S.TopWrapper>
          </S.Top>
          <S.Bottom></S.Bottom>
        </S.Frame>
      </S.Container>
    </>
  );
}
