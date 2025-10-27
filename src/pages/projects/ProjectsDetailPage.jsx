import * as S from "./styles/projectsDetailPage";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { projectList } from "@/data/projectList";

export default function ProjectsDetailPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const project = projectList.find((p) => p.id == +projectId) ?? [];

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
            <S.BottomWrapper>
              <S.TaskBoxWrapper>
                {project.tasks ? (
                  project.tasks.map((task) => (
                    <S.TaskBox
                      key={task.id}
                      onClick={() =>
                        navigate(`/projects/${project.id}/tasks/${task.id}`, {
                          state: { task },
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
                  ))
                ) : (
                  <h1>작업이 없습니다.</h1>
                )}
              </S.TaskBoxWrapper>
              <S.CreditBox>
                <S.CreditBoxTop>
                  <S.CreditText>총 크레딧</S.CreditText>
                  <S.CreditAmount>1,000</S.CreditAmount>
                  <S.DescribeText>사용 가능한 크레딧</S.DescribeText>
                  <S.Line />
                  <S.DescribeText>크레딧으로 할 수 있는 기능</S.DescribeText>
                </S.CreditBoxTop>
                <S.CreditBoxBottom>
                  <S.ShopButton onClick={() => navigate(`/shop`)}>
                    상점으로 가기
                  </S.ShopButton>
                </S.CreditBoxBottom>
              </S.CreditBox>
            </S.BottomWrapper>
          </S.Bottom>
        </S.Frame>
      </S.Container>
    </>
  );
}
