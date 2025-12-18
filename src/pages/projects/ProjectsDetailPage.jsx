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

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false); // For tasks

  // Edit Form State
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editThumbnail, setEditThumbnail] = useState(null); // Preview
  const [editThumbnailFile, setEditThumbnailFile] = useState(null); // File object

  // Task Form State (keeping existing local logic for tasks if API not ready, but user asked for project CRUD)
  // The user swagger shows "members" in project response but "tasks" are not explicitly in the top level.
  // Converting existing "tasks" logic to just be UI placeholder if API doesn't support tasks yet, 
  // OR if the swagger response shows tasks inside project? The swagger response shows "members" but NOT "tasks".
  // However, the original code had tasks. I will keep tasks as local state or just display them if they were part of the object.
  // IMPORTANT: The swagger schema for GET /projects/{id} does NOT show tasks. 
  // It shows: projectId, title, content, major, profile, members.
  // I will assume tasks are NOT supported in this API update yet or are separate.
  // I will comment out task creation logic or keep it harmlessly if it doesn't break anything. 
  // Actually, I should probably focus on the Project CRUD parts.
  // I'll keep the task UI but it might be empty.

  const userCredit = profiles[0].credit; // Mock credit for now

  useEffect(() => {
    fetchProjectDetail();
  }, [projectId]);

  const fetchProjectDetail = async () => {
    try {
      const token = Cookies.get("accessToken");
      const isTokenValid = token && token !== "logged-in";
      const headers = { "Accept": "application/json" };
      if (isTokenValid) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await axios.get(`${API_URL}/projects/${projectId}`, {
        headers: headers,
        withCredentials: true,
      });

      const data = res.data;
      setProject(data);
      setEditTitle(data.title);
      setEditDescription(data.content);
      setEditThumbnail(data.profile); // Initialize with existing profile URL
      setEditThumbnailFile(null);
    } catch (err) {
      console.error("Failed to fetch project detail:", err);
      Alarm("❌", "프로젝트를 불러오지 못했습니다.", "#FF1E1E", "#FFEAEA");
      navigate("/projects");
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

      // Update text fields
      const res = await axios.put(`${API_URL}/projects/${projectId}`, {
        title: editTitle,
        content: editDescription,
        major: project.major || "BACKEND"
      }, {
        headers: headers,
        withCredentials: true
      });

      let updatedData = res.data;

      // Update image if file selected
      if (editThumbnailFile) {
        try {
          const formData = new FormData();
          formData.append("file", editThumbnailFile);

          const imgHeaders = {};
          if (token) imgHeaders["Authorization"] = `Bearer ${token}`;

          // Wait for image upload
          await axios.put(`${API_URL}/projects/profile/image/${projectId}`, formData, {
            headers: { ...imgHeaders, "Content-Type": "multipart/form-data" },
            withCredentials: true
          });

          // Fetch latest data to get new image URL or just trust the flow? 
          // Better to assume success or refetch. Let's rely on refetching detail after close or assume 
          // the previous response + local file usage (complex). 
          // Simplest: We will refetch the whole project data below.
        } catch (imgErr) {
          console.error("Image update failed:", imgErr);
          Alarm("⚠️", "정보는 수정되었으나 이미지 업로드에 실패했습니다.", "#FFB74D", "#FFF3E0");
        }
      }

      setProject(updatedData);
      setIsEditModalOpen(false);
      Alarm("✅", "프로젝트가 수정되었습니다.", "#4CAF50", "#E8F5E9");
      fetchProjectDetail(); // Refresh strictly to see new image
    } catch (err) {
      console.error("Failed to update project:", err);
      Alarm("❌", "프로젝트 수정에 실패했습니다.", "#FF1E1E", "#FFEAEA");
    }
  };

  const deleteProject = async () => {
    try {
      const token = Cookies.get("accessToken");
      const isTokenValid = token && token !== "logged-in";
      const headers = { "Accept": "application/json" };
      if (isTokenValid) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      await axios.delete(`${API_URL}/projects/${projectId}`, {
        headers: headers,
        withCredentials: true
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
  const closeEditModal = () => setIsEditModalOpen(false);

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setIsMoreOpen(false);
  };
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const moreClicked = () => setIsMoreOpen((prev) => !prev);

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
                onClick={moreClicked}
              />

              {isMoreOpen && (
                <S.MoreBox>
                  <S.MoreItem onClick={openEditModal}>
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
            <S.Banner $backgroundImage={project.profile || "/assets/dummy-thumbnail.svg"}></S.Banner>
            <S.BottomWrapper>
              <S.BottomLeft>
                <S.BottomTop>
                  <S.TaskBoxTitle>업무 (Tasks)</S.TaskBoxTitle>
                  <S.TaskBoxAddButton
                    src="/assets/plus-icon.svg"
                    alt="새 업무 추가"
                    style={{ width: "18px", cursor: "pointer", marginLeft: "auto" }}
                    onClick={() => Alarm("⚠️", "업무 기능은 준비중입니다.", "#FFB74D", "#FFF3E0")}
                  />
                </S.BottomTop>

                <S.TaskBoxWrapper>
                  {/* Tasks are not in the Project API response yet. Placeholder. */}
                  <p style={{ padding: "20px", color: "#888" }}>업무 목록이 없습니다.</p>
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
        <S.ModalOverlay onClick={closeEditModal}>
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

              {/* Image Upload for Edit */}
              <S.ProjectDesInputBox>
                <S.ProjectDesInputText>프로젝트 사진</S.ProjectDesInputText>
                <label htmlFor="edit-project-file" style={{ cursor: "pointer", display: "inline-block" }}>
                  <img
                    src={editThumbnail || project.profile || "/assets/dummy-thumbnail.svg"}
                    alt="Cover"
                    style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px", marginTop: "10px" }}
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
                <S.CancelButton onClick={closeEditModal}>취소</S.CancelButton>
                <S.CreateButton onClick={updateProject}>수정</S.CreateButton>
              </S.ButtonGroup>
            </S.ModalWrapper>
          </S.ModalContent>
        </S.ModalOverlay>
      )}

      {/* Delete Modal */}
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
