import * as S from "./styles/projectsDetailPage";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { projectList } from "@/data/projectList";

export default function ProjectsDetailPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const project = projectList.find((p) => p.id == +projectId) ?? [];

  // ✅ 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newThumbnail, setNewThumbnail] = useState(null);

  // ✅ 모달 열기/닫기
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTitle("");
    setNewDescription("");
    setNewThumbnail(null);
  };

  // ✅ 파일 업로드 핸들러
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setNewThumbnail(imageURL);
    }
  };

  // ✅ 새 업무(Task) 추가
  const handleAddProject = () => {
    if (newTitle.trim() === "") return alert("업무 이름을 입력하세요.");

    const newTask = {
      id: Date.now(), // 임시로 timestamp를 ID로 사용
      title: newTitle,
      description: newDescription,
      isDone: false,
    };

    const targetProject = projectList.find((p) => p.id === +projectId);

    if (!targetProject) {
      alert("프로젝트를 찾을 수 없습니다!");
      return;
    }

    // ✅ 현재 프로젝트의 tasks에 push
    targetProject.tasks.push(newTask);

    closeModal();
  };

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
              <S.BottomLeft>
                <S.BottomTop>
                  <S.TaskBoxTitle>업무</S.TaskBoxTitle>
                  <S.TaskBoxAddButton
                    src="/assets/plus-icon.svg"
                    alt="새 프로젝트 추가"
                    style={{
                      width: "18px",
                      cursor: "pointer",
                      marginLeft: "auto",
                    }}
                    onClick={openModal}
                  />
                </S.BottomTop>
                <S.TaskBoxWrapper>
                  {project.tasks?.length ? (
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
                    <p>작업이 없습니다.</p>
                  )}
                </S.TaskBoxWrapper>
              </S.BottomLeft>

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

      {/* ✅ ProjectsPage에서 쓰던 모달 그대로 추가 */}
      {isModalOpen && (
        <S.ModalOverlay onClick={closeModal}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalWrapper>
              <S.ModalTitle>새 업무 만들기</S.ModalTitle>

              <S.ProjectInputBox>
                <S.ProjectInputText>업무 이름</S.ProjectInputText>
                <S.ProjectInput
                  type="text"
                  placeholder="업무 이름을 입력하세요."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </S.ProjectInputBox>

              <S.ProjectDesInputBox>
                <S.ProjectDesInputText>업무 설명</S.ProjectDesInputText>
                <S.ProjectDesInput
                  type="text"
                  placeholder="이 업무에 대한 간단한 설명을 적어주세요."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </S.ProjectDesInputBox>

              <S.ButtonGroup>
                <S.CancelButton onClick={closeModal}>취소</S.CancelButton>
                <S.CreateButton onClick={handleAddProject}>생성</S.CreateButton>
              </S.ButtonGroup>
            </S.ModalWrapper>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </>
  );
}
