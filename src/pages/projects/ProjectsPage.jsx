import * as S from "./styles/projectsPage";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alarm } from "@/toasts/Alarm";
import profiles from "@/data/profile";
import { useEffect } from "react";
import { API_URL } from "@/constants/api";
import axios from "axios";
import Cookies from "js-cookie";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newThumbnail, setNewThumbnail] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const userName = profiles[0].id;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTitle("");
    setNewDescription("");
    setNewThumbnail(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setNewThumbnail(imageURL);
    }
  };

  const createProject = async () => {
    if (newTitle.trim() === "") {
      return Alarm("‼️", "프로젝트 이름을 입력하세요.", "#FF1E1E", "#FFEAEA");
    }

    try {
      const token = Cookies.get("accessToken");
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      if (token && token !== "logged-in") {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await axios.post(
        `${API_URL}/projects`,
        {
          title: newTitle,
          content: newDescription,
        },
        {
          headers: headers,
          withCredentials: true,
        }
      );

      console.log(response.data);
      Alarm("✅", "프로젝트가 생성되었습니다!", "#4CAF50", "#E8F5E9");
      await fetchProjects();
      closeModal();
    } catch (err) {
      console.error("Failed to create project:", err);
      Alarm("❌", "프로젝트 생성에 실패했습니다.", "#FF1E1E", "#FFEAEA");
    }
  };

  const fetchProjects = async () => {
    try {
      const token = Cookies.get("accessToken");
      const headers = {
        Accept: "application/json",
      };

      if (token && token !== "logged-in") {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await axios.get(`${API_URL}/projects/my-projects`, {
        headers: headers,
        withCredentials: true,
      });

      const data = response.data;
      console.log(data);

      // 스웨거 응답 형식: { status: 0, data: [...] }
      if (data.data) {
        setProjects(data.data);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      if (err.response) {
        console.error("Server Error:", err.response.data);
        console.error("Status:", err.response.status);
      }
      setProjects([]);
    }
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
            프로젝트
            <S.PlusButton
              src="/assets/plus-icon.svg"
              alt="플러스 아이콘"
              onClick={openModal}
            />
          </S.Top>

          <S.Bottom>
            {projects.length === 0 ? (
              <S.EmptyState>
                <S.EmptyText>아직 프로젝트가 없어요.</S.EmptyText>
                <S.EmptySubText>
                  아래 버튼을 눌러 새 프로젝트를 만들어보세요!
                </S.EmptySubText>
                <S.EmptyButton onClick={openModal}>
                  새 프로젝트 만들기
                </S.EmptyButton>
              </S.EmptyState>
            ) : (
              projects.map((project) => (
                <S.Box
                  key={project.projectId}
                  onClick={() => navigate(`/projects/${project.projectId}`)}
                >
                  <S.Thumbnail
                    src={project.profile || "/assets/dummy-thumbnail.svg"}
                    alt={`썸네일`}
                  />
                  <S.BoxBottom>
                    <S.Title>{project.title}</S.Title>
                    <S.Owner>{userName}</S.Owner>
                  </S.BoxBottom>
                </S.Box>
              ))
            )}
          </S.Bottom>
        </S.Frame>
      </S.Container>

      {isModalOpen && (
        <S.ModalOverlay onClick={closeModal}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalWrapper>
              <S.ModalTitle>새 프로젝트 만들기</S.ModalTitle>

              <S.ProjectInputBox>
                <S.ProjectInputText>프로젝트 이름</S.ProjectInputText>
                <S.ProjectInput
                  type="text"
                  placeholder="프로젝트 이름을 입력하세요."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </S.ProjectInputBox>

              <S.ProjectDesInputBox>
                <S.ProjectDesInputText>프로젝트 설명</S.ProjectDesInputText>
                <S.ProjectDesInput
                  type="text"
                  placeholder="이 프로젝트에 대한 간단한 설명을 적어주세요."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </S.ProjectDesInputBox>

              <S.ProjectPictureBox>
                <S.ProjectPictureText>프로젝트 사진</S.ProjectPictureText>
                <S.ProjectPictureLabel htmlFor="project-file">
                  <S.ProjectPicture
                    src={newThumbnail || "./assets/picture-upload.svg"}
                    alt="업로드 미리보기"
                  />
                </S.ProjectPictureLabel>
                <S.ProjectPictureInput
                  id="project-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </S.ProjectPictureBox>

              <S.ButtonGroup>
                <S.CancelButton onClick={closeModal}>취소</S.CancelButton>
                <S.CreateButton onClick={createProject}>생성</S.CreateButton>
              </S.ButtonGroup>
            </S.ModalWrapper>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </>
  );
}
