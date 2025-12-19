import * as S from "./styles/projectsDetailPage";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Alarm } from "@/toasts/Alarm";
import { API_URL } from "@/constants/api";
import profiles from "@/data/profile";
import Cookies from "js-cookie";
import axios from "axios";

export default function ProjectsDetailPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Edit Form State
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editThumbnail, setEditThumbnail] = useState(null);
  const [editThumbnailFile, setEditThumbnailFile] = useState(null);

  // Task Form State
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("TODO");

  const userCredit = profiles[0].credit;

  useEffect(() => {
    fetchProjectDetail();
    fetchTasks();
  }, [projectId]);

  const getAuthHeaders = () => {
    const token = Cookies.get("accessToken");
    const isTokenValid = token && token !== "logged-in";
    const headers = { Accept: "application/json" };
    if (isTokenValid) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchProjectDetail = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects/${projectId}`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      const data = res.data;
      setProject(data);
      setEditTitle(data.title);
      setEditDescription(data.content);
      setEditThumbnail(data.profile);
      setEditThumbnailFile(null);
    } catch (err) {
      console.error("Failed to fetch project detail:", err);
      Alarm("❌", "프로젝트를 불러오지 못했습니다.", "#FF1E1E", "#FFEAEA");
      navigate("/projects");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects/${projectId}/tasks`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      setTasks(res.data || []);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setTasks([]);
    }
  };

  const createTask = async () => {
    if (!taskTitle.trim()) {
      Alarm("⚠️", "업무 제목을 입력해주세요.", "#FFB74D", "#FFF3E0");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/projects/${projectId}/tasks`,
        {
          title: taskTitle,
          description: taskDescription,
          status: taskStatus,
        },
        {
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      Alarm("✅", "업무가 생성되었습니다.", "#4CAF50", "#E8F5E9");
      setIsTaskModalOpen(false);
      setTaskTitle("");
      setTaskDescription("");
      setTaskStatus("TODO");
      fetchTasks();
    } catch (err) {
      console.error("Failed to create task:", err);
      Alarm("❌", "업무 생성에 실패했습니다.", "#FF1E1E", "#FFEAEA");
    }
  };

  const updateProject = async () => {
    try {
      const token = Cookies.get("accessToken");
      const isTokenValid = token && token !== "logged-in";
      const headers = { "Content-Type": "application/json" };
      if (isTokenValid) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await axios.put(
        `${API_URL}/projects/${projectId}`,
        {
          title: editTitle,
          content: editDescription,
          major: project.major || "BACKEND",
        },
        {
          headers: headers,
          withCredentials: true,
        }
      );

      let updatedData = res.data;

      if (editThumbnailFile) {
        try {
          const formData = new FormData();
          formData.append("file", editThumbnailFile);

          const imgHeaders = {};
          if (token) imgHeaders["Authorization"] = `Bearer ${token}`;

          await axios.put(
            `${API_URL}/projects/profile/image/${projectId}`,
            formData,
            {
              headers: { ...imgHeaders, "Content-Type": "multipart/form-data" },
              withCredentials: true,
            }
          );
        } catch (imgErr) {
          console.error("Image update failed:", imgErr);
          Alarm(
            "⚠️",
            "정보는 수정되었으나 이미지 업로드에 실패했습니다.",
            "#FFB74D",
            "#FFF3E0"
          );
        }
      }

      setProject(updatedData);
      setIsEditModalOpen(false);
      Alarm("✅", "프로젝트가 수정되었습니다.", "#4CAF50", "#E8F5E9");
      fetchProjectDetail();
    } catch (err) {
      console.error("Failed to update project:", err);
      Alarm("❌", "프로젝트 수정에 실패했습니다.", "#FF1E1E", "#FFEAEA");
    }
  };

  const deleteProject = async () => {
    try {
      await axios.delete(`${API_URL}/projects/${projectId}`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      Alarm("🗑️", "프로젝트가 삭제되었습니다.", "#FF1E1E", "#FFEAEA");
      navigate("/projects");
    } catch (err) {
      console.error("Failed to delete project:", err);
      Alarm("❌", "프로젝트 삭제에 실패했습니다.", "#FF1E1E", "#FFEAEA");
    }
  };

  const openEditModal = () => {
    setEditTitle(project.title);
    setEditDescription(project.content);
    setEditThumbnail(project.profile);
    setEditThumbnailFile(null);
    setIsEditModalOpen(true);
    setIsMoreOpen(false);
  };

  const handleTaskClick = (task) => {
    navigate(`/projects/${projectId}/tasks/${task.taskId}`, {
      state: { task, projectId },
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "TODO":
        return "#FF9800";
      case "IN_PROGRESS":
        return "#2196F3";
      case "DONE":
        return "#4CAF50";
      default:
        return "#757575";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "TODO":
        return "할 일";
      case "IN_PROGRESS":
        return "진행중";
      case "DONE":
        return "완료";
      default:
        return status;
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <>
      <Helmet>
        <title>Devit - {project.title}</title>
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
                onClick={() => setIsMoreOpen((prev) => !prev)}
              />

              {isMoreOpen && (
                <S.MoreBox>
                  <S.MoreItem onClick={openEditModal}>프로젝트 설정</S.MoreItem>
                  <S.MoreItem
                    style={{ color: "red" }}
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setIsMoreOpen(false);
                    }}
                  >
                    삭제
                  </S.MoreItem>
                </S.MoreBox>
              )}
            </S.TopWrapper>
          </S.Top>

          <S.Bottom>
            <S.Banner
              $backgroundImage={
                project.profile || "/assets/dummy-thumbnail.svg"
              }
            ></S.Banner>
            <S.BottomWrapper>
              <S.BottomLeft>
                <S.BottomTop>
                  <S.TaskBoxTitle>업무 (Tasks)</S.TaskBoxTitle>
                  <S.TaskBoxAddButton
                    src="/assets/plus-icon.svg"
                    alt="새 업무 추가"
                    style={{
                      width: "18px",
                      cursor: "pointer",
                      marginLeft: "auto",
                    }}
                    onClick={() => setIsTaskModalOpen(true)}
                  />
                </S.BottomTop>

                <S.TaskBoxWrapper>
                  {tasks.length === 0 ? (
                    <p style={{ padding: "20px", color: "#888" }}>
                      업무 목록이 없습니다.
                    </p>
                  ) : (
                    tasks.map((task) => (
                      <div
                        key={task.taskId}
                        onClick={() => handleTaskClick(task)}
                        style={{
                          padding: "15px",
                          margin: "10px 0",
                          backgroundColor: "#f5f5f5",
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#e8e8e8";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#f5f5f5";
                        }}
                      >
                        <h4 style={{ margin: "0 0 8px 0" }}>{task.title}</h4>
                        <p
                          style={{
                            margin: "0 0 8px 0",
                            color: "#666",
                            fontSize: "14px",
                          }}
                        >
                          {task.description}
                        </p>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 8px",
                            backgroundColor: getStatusColor(task.status),
                            color: "white",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        >
                          {getStatusText(task.status)}
                        </span>
                      </div>
                    ))
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

      {/* Edit Modal */}
      {isEditModalOpen && (
        <S.ModalOverlay onClick={() => setIsEditModalOpen(false)}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalWrapper>
              <S.ModalTitle>프로젝트 수정</S.ModalTitle>
              <S.ProjectInputBox>
                <S.ProjectInputText>프로젝트 이름</S.ProjectInputText>
                <S.ProjectInput
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </S.ProjectInputBox>

              <S.ProjectDesInputBox>
                <S.ProjectDesInputText>프로젝트 설명</S.ProjectDesInputText>
                <S.ProjectDesInput
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </S.ProjectDesInputBox>

              <S.ProjectDesInputBox>
                <S.ProjectDesInputText>프로젝트 사진</S.ProjectDesInputText>
                <label
                  htmlFor="edit-project-file"
                  style={{ cursor: "pointer", display: "inline-block" }}
                >
                  <img
                    src={
                      editThumbnail ||
                      project.profile ||
                      "/assets/dummy-thumbnail.svg"
                    }
                    alt="Cover"
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginTop: "10px",
                    }}
                  />
                </label>
                <input
                  id="edit-project-file"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setEditThumbnail(URL.createObjectURL(file));
                      setEditThumbnailFile(file);
                    }
                  }}
                />
              </S.ProjectDesInputBox>

              <S.ButtonGroup>
                <S.CancelButton onClick={() => setIsEditModalOpen(false)}>
                  취소
                </S.CancelButton>
                <S.CreateButton onClick={updateProject}>수정</S.CreateButton>
              </S.ButtonGroup>
            </S.ModalWrapper>
          </S.ModalContent>
        </S.ModalOverlay>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <S.ModalOverlay onClick={() => setIsDeleteModalOpen(false)}>
          <S.DeleteModalContent onClick={(e) => e.stopPropagation()}>
            <S.DeleteModalWrapper>
              <S.ModalTitle>프로젝트 삭제</S.ModalTitle>
              <S.WarningText>
                <strong>{project.title}</strong>를 삭제하시겠습니까?
              </S.WarningText>
              <S.ButtonGroup>
                <S.CancelButton onClick={() => setIsDeleteModalOpen(false)}>
                  취소
                </S.CancelButton>
                <S.DeleteButton onClick={deleteProject}>삭제</S.DeleteButton>
              </S.ButtonGroup>
            </S.DeleteModalWrapper>
          </S.DeleteModalContent>
        </S.ModalOverlay>
      )}

      {/* Task Create Modal */}
      {isTaskModalOpen && (
        <S.ModalOverlay onClick={() => setIsTaskModalOpen(false)}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalWrapper>
              <S.ModalTitle>업무 추가</S.ModalTitle>
              <S.ProjectInputBox>
                <S.ProjectInputText>업무 제목</S.ProjectInputText>
                <S.ProjectInput
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="업무 제목을 입력하세요"
                />
              </S.ProjectInputBox>

              <S.ProjectDesInputBox>
                <S.ProjectDesInputText>업무 설명</S.ProjectDesInputText>
                <S.ProjectDesInput
                  type="text"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="업무 설명을 입력하세요"
                />
              </S.ProjectDesInputBox>

              <S.ProjectInputBox>
                <S.ProjectInputText>상태</S.ProjectInputText>
                <select
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    width: "100%",
                  }}
                >
                  <option value="TODO">할 일</option>
                  <option value="IN_PROGRESS">진행중</option>
                  <option value="DONE">완료</option>
                </select>
              </S.ProjectInputBox>

              <S.ButtonGroup>
                <S.CancelButton onClick={() => setIsTaskModalOpen(false)}>
                  취소
                </S.CancelButton>
                <S.CreateButton onClick={createTask}>생성</S.CreateButton>
              </S.ButtonGroup>
            </S.ModalWrapper>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </>
  );
}
