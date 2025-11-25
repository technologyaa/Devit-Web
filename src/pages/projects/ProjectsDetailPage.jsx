import * as S from "./styles/projectsDetailPage";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import profiles from "@/data/profile";
import { Alarm } from "@/toasts/Alarm";
import { API_URL } from "@/constants/api";

export default function ProjectsDetailPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [project, setProject] = useState(null); // 프로젝트 데이터
  const [tasks, setTasks] = useState([]); // 업무 리스트
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const userCredit = profiles[0].credit;

  // 프로젝트 불러오기
  useEffect(() => {
    fetchProjectDetail();
    fetchTasks();
  }, [projectId]);

  const fetchProjectDetail = async () => {
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}`);
      const data = await res.json();
      setProject(data);
    } catch (err) {
      console.error("프로젝트 로딩 실패:", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("업무 로딩 실패:", err);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTitle("");
    setNewDescription("");
  };

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const moreClicked = () => {
    setIsMoreOpen((prev) => !prev);
  };

  // 업무 생성
  const handleAddTask = async () => {
    if (newTitle.trim() === "")
      return Alarm("‼️", "업무 이름을 입력하세요!", "#FF1E1E", "#FFEAEA");

    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
        }),
      });

      if (!res.ok) throw new Error();

      Alarm("✅", "업무가 추가되었습니다!", "#4CAF50", "#E8F5E9");

      closeModal();
      fetchTasks();
    } catch (err) {
      Alarm("❌", "업무 생성에 실패했습니다.", "#FF1E1E", "#FFEAEA");
    }
  };

  // 프로젝트 삭제
  const deleteProject = async () => {
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      Alarm("🗑️", "프로젝트가 삭제되었습니다.", "#FF1E1E", "#FFEAEA");

      closeDeleteModal();
      navigate("/projects");
    } catch (err) {
      Alarm("❌", "프로젝트 삭제 실패", "#FF1E1E", "#FFEAEA");
    }
  };

  if (!project) return <p style={{ padding: "30px" }}>로딩중...</p>;

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
              <S.TopLeft>
                <S.BackIcon
                  onClick={() => navigate("/projects")}
                  src="/assets/back-icon.svg"
                />
                <S.ProjectText>{project.title}</S.ProjectText>
              </S.TopLeft>

              <S.ProjectSettingsIcon
                src="/assets/more-icon.svg"
                alt="프로젝트 설정 아이콘"
                onClick={moreClicked}
              />

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

          <S.Bottom>
            <S.Banner $backgroundImage={project.thumbnail} />
            <S.BottomWrapper>
              <S.BottomLeft>
                <S.BottomTop>
                  <S.TaskBoxTitle>업무</S.TaskBoxTitle>
                  <S.TaskBoxAddButton
                    src="/assets/plus-icon.svg"
                    alt="새 업무 추가"
                    style={{
                      width: "18px",
                      cursor: "pointer",
                      marginLeft: "auto",
                    }}
                    onClick={openModal}
                  />
                </S.BottomTop>

                <S.TaskBoxWrapper>
                  {tasks.length ? (
                    tasks.map((task) => (
                      <S.TaskBox
                        key={task.id}
                        onClick={() =>
                          navigate(`/projects/${project.id}/tasks/${task.id}`, {
                            state: { task, projectId },
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
                  <S.CreditAmount>{userCredit}</S.CreditAmount>
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
                <S.CreateButton onClick={handleAddTask}>생성</S.CreateButton>
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
                <S.DeleteButton onClick={deleteProject}>삭제</S.DeleteButton>
              </S.ButtonGroup>
            </S.DeleteModalWrapper>
          </S.DeleteModalContent>
        </S.ModalOverlay>
      )}
    </>
  );
}
