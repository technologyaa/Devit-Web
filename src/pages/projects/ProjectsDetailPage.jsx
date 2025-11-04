import * as S from "./styles/projectsDetailPage";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { projectList } from "@/data/project-list";
import { Alarm } from "@/toasts/Alarm";

export default function ProjectsDetailPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const project = projectList.find((p) => p.id == +projectId) ?? [];

  // ✅ 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // ✅ 업무 추가 모달
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTitle("");
    setNewDescription("");
  };

  // ✅ 삭제 모달
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  // ✅ 프로젝트 삭제
  const handleDeleteProject = () => {
    const index = projectList.findIndex((p) => p.id === +projectId);
    if (index !== -1) {
      projectList.splice(index, 1);
      Alarm("🗑️", "프로젝트가 삭제되었습니다.", "#FF1E1E", "#FFEAEA");
      navigate("/projects");
    } else {
      Alarm("‼️", "프로젝트를 찾을 수 없습니다.", "#FF1E1E", "#FFEAEA");
    }
  };

  // ✅ 더보기 메뉴
  const moreClicked = () => {
    setIsMoreOpen((prevIsMoreOpen) => !prevIsMoreOpen);
  };

  // ✅ 업무 추가
  const handleAddProject = () => {
    if (newTitle.trim() === "")
      return Alarm("‼️", "업무 이름을 입력하세요!", "#FF1E1E", "#FFEAEA");
    const targetProject = projectList.find((p) => p.id === +projectId);
    if (!targetProject)
      return Alarm("‼️", "프로젝트를 찾을 수 없습니다.!", "#FF1E1E", "#FFEAEA");

    targetProject.tasks = targetProject.tasks ?? [];

    targetProject.tasks = targetProject.tasks.map((t, i) => ({
      ...t,
      id: i + 1,
    }));

    const newTask = {
      id: targetProject.tasks.length + 1,
      title: newTitle,
      description: newDescription,
      isDone: false,
    };

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
          {/* 상단 영역 */}
          <S.Top>
            <S.TopWrapper>
              <S.TopLeft>
                <S.BackIcon
                  onClick={() => navigate("/projects")}
                  src="/assets/back-icon.svg"
                />
                <S.ProjectText>{project?.title}</S.ProjectText>
              </S.TopLeft>

              <S.ProjectSettingsIcon
                src="/assets/more-icon.svg"
                alt="프로젝트 설정 아이콘"
                onClick={moreClicked}
              />

              {/* 더보기 메뉴 */}
              {isMoreOpen && (
                <S.MoreBox>
                  <S.MoreItem
                    onClick={() =>
                      Alarm(
                        "🛠️",
                        "아직 개발중인 기능입니다.",
                        "#883cbe",
                        "#f3e8ff"
                      )
                    }
                  >
                    프로젝트 설정
                  </S.MoreItem>
                  <S.MoreItem
                    style={{ color: "red" }}
                    onClick={openDeleteModal}
                  >
                    삭제
                  </S.MoreItem>
                </S.MoreBox>
              )}
            </S.TopWrapper>
          </S.Top>

          {/* 하단 영역 */}
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

                {/* 업무 리스트 */}
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

              {/* 크레딧 박스 */}
              <S.CreditBox>
                <S.CreditBoxTop>
                  <S.CreditText>총 크레딧</S.CreditText>
                  <S.CreditAmount>1,000</S.CreditAmount>
                  <S.DescribeText>사용 가능한 크레딧</S.DescribeText>
                  <S.Line />
                  <S.DescribeText>크레딧으로 할 수 있는 기능</S.DescribeText>
                </S.CreditBoxTop>
                <S.CreditBoxBottom>
                  <S.ShopButton onClick={() => navigate("/shop")}>
                    상점으로 가기
                  </S.ShopButton>
                </S.CreditBoxBottom>
              </S.CreditBox>
            </S.BottomWrapper>
          </S.Bottom>
        </S.Frame>
      </S.Container>

      {/* ✅ 새 업무 추가 모달 */}
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

      {isDeleteModalOpen && (
        <S.ModalOverlay onClick={closeDeleteModal}>
          <S.DeleteModalContent onClick={(e) => e.stopPropagation()}>
            <S.DeleteModalWrapper>
              <S.ModalTitle>프로젝트 삭제</S.ModalTitle>
              <S.WarningText>
                <strong>{project.title}</strong>를 삭제하시겠습니까?
              </S.WarningText>
              <S.ButtonGroup>
                <S.CancelButton onClick={closeDeleteModal}>취소</S.CancelButton>
                <S.DeleteButton onClick={handleDeleteProject}>
                  삭제
                </S.DeleteButton>
              </S.ButtonGroup>
            </S.DeleteModalWrapper>
          </S.DeleteModalContent>
        </S.ModalOverlay>
      )}
    </>
  );
}
