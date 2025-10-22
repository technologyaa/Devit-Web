import * as S from "./styles/projectsDetailPage";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { projectList } from "@/data/projectList";

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
                onClick={() => navigate(`/projects`)}
                src="/assets/back-icon.svg"
              />
              <S.ProjectText>{project?.title}</S.ProjectText>
            </S.TopWrapper>
          </S.Top>
          <S.Bottom>
            <S.Banner></S.Banner>
            <S.TaskBoxWrapper>
              {project.tasks.map((task) => (
                <S.TaskBox
                  key={task.id}
                  onClick={() =>
                    navigate(`/tasks/${task.id}`, {
                      state: { task }, // ✅ task 정보 함께 전달
                    })
                  }
                >
                  <S.TaskBoxLeft>
                    <S.TaskImage src="/assets/task-icon.svg" />
                    <S.TaskTitle>{task.title}</S.TaskTitle>
                  </S.TaskBoxLeft>

                  <S.TaskBoxRight>
                    <S.TaskStatus isDone={task.isDone}>
                      {task.isDone ? "완료" : "미완료"}
                    </S.TaskStatus>
                  </S.TaskBoxRight>
                </S.TaskBox>
              ))}
            </S.TaskBoxWrapper>
          </S.Bottom>
        </S.Frame>
      </S.Container>
    </>
  );
}
