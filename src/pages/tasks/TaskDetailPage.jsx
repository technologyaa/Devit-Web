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
            <S.TaskStatus isDone={task.isDone}>
              {task.isDone ? "완료" : "미완료"}
            </S.TaskStatus>
          </S.Top>
          <S.Bottom>
            <S.DescriptionText>{task.description}</S.DescriptionText>
            <S.SubmitBox>
              <S.SubmitBoxTop>
                <S.SubmitText>내 과제</S.SubmitText>
                <S.SubmitPrice>가격: 1,000</S.SubmitPrice>
              </S.SubmitBoxTop>
              <S.SubmitBoxBottom>
                <S.UploadButton>
                  추가
                  <S.FileInput type="file" />
                </S.UploadButton>
                <S.SubmitButton>제출하기</S.SubmitButton>
              </S.SubmitBoxBottom>
            </S.SubmitBox>
          </S.Bottom>
        </S.Frame>
      </S.Container>
    </>
  );
}
