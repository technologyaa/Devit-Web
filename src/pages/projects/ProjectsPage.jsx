import * as S from "./styles/projectsPage";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { projectList } from "@/data/projectList";

export default function ProjectsPage() {
  const navigate = useNavigate(); // ✅ 네비게이트 훅 사용

  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="./assets/Helmet.svg" />
      </Helmet>

      <S.Container>
        <S.Frame>
          <S.Top>프로젝트</S.Top>
          <S.Bottom>
            {projectList.map((project) => (
              <S.Box
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)} // ✅ 클릭 시 이동
                style={{ cursor: "pointer" }} // 마우스 포인터 모양 변경
              >
                <S.Thumbnail
                  src={project.thumbnail}
                  alt={`${project.title} 썸네일`}
                />
                <S.BoxBottom>
                  <S.Title>{project.title}</S.Title>
                  <S.Owner>{project.owner}</S.Owner>
                </S.BoxBottom>
              </S.Box>
            ))}
          </S.Bottom>
        </S.Frame>
      </S.Container>
    </>
  );
}
