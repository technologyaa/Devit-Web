import * as S from "./styles/projectsPage";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alarm } from "@/toasts/Alarm";
import profiles from "@/data/profile";
import { useEffect } from "react";
import { API_URL } from "@/constants/api";
import Cookies from "js-cookie";
import axios from "axios";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newThumbnail, setNewThumbnail] = useState(null); // Preview URL
  const [newThumbnailFile, setNewThumbnailFile] = useState(null); // Actual File object
  const [job, setJob] = useState("BACKEND"); // Project major field

  useEffect(() => {
    fetchProjects();

    // Diagnostic: Check if "my-projects" endpoint works (to see if it's just GET /projects that's broken)
    const checkMyProjects = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (token && token !== "logged-in") {
          const res = await axios.get(`${API_URL}/projects/my-projects`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            withCredentials: true
          });
          console.log("Diagnostic /projects/my-projects SUCCESS:", res.data);
        }
      } catch (err) {
        console.error("Diagnostic /projects/my-projects FAILED:", err.response ? err.response.status : err);
      }
    };
    checkMyProjects();

  }, []);

  const userName = profiles[0].id;
  console.log(userName);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTitle("");
    setNewDescription("");
    setNewThumbnail(null);
    setNewThumbnailFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setNewThumbnail(imageURL);
      setNewThumbnailFile(file);
    }
  };

  // const handleAddProject = () => {
  //   if (newTitle.trim() === "")
  //     return Alarm("‼️", "프로젝트 이름을 입력하세요.", "#FF1E1E", "#FFEAEA");

  //   const newProject = {
  //     id: projects.length + 1,
  //     title: newTitle,
  //     description: newDescription,
  //     owner: userName,
  //     thumbnail: newThumbnail || "/assets/dummy-thumbnail.svg",
  //     tasks: [],
  //   };

  //   setProjects([...projects, newProject]);
  //   initialProjects.push(newProject);
  //   closeModal();
  // };

  const createProject = async () => {
    if (newTitle.trim() === "") {
      return Alarm("‼️", "프로젝트 이름을 입력하세요.", "#FF1E1E", "#FFEAEA");
    }

    try {
      const token = Cookies.get("accessToken");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await axios.post(`${API_URL}/projects`, {
        title: newTitle,
        content: newDescription,
        major: job
      }, {
        headers: headers,
        withCredentials: true
      });

      if (res.status === 200 || res.status === 201) {
        const createdProject = res.data;
        // If there's an image to upload, do it now
        if (newThumbnailFile && createdProject && createdProject.projectId) {
          try {
            const formData = new FormData();
            formData.append("file", newThumbnailFile); // Assuming 'file' is the key

            const imgHeaders = {};
            if (token) imgHeaders["Authorization"] = `Bearer ${token}`;

            await axios.put(`${API_URL}/projects/profile/image/${createdProject.projectId}`, formData, {
              headers: {
                ...imgHeaders,
                "Content-Type": "multipart/form-data"
              },
              withCredentials: true
            });
            console.log("Image uploaded successfully");
          } catch (imgErr) {
            console.error("Failed to upload image during creation:", imgErr);
            Alarm("⚠️", "프로젝트는 생성되었으나 이미지 업로드에 실패했습니다.", "#FFB74D", "#FFF3E0");
          }
        }

        Alarm("✅", "프로젝트가 생성되었습니다.", "#3CAF50", "#E8F5E9");
        setIsModalOpen(false);
        setNewTitle("");
        setNewDescription("");
        setNewThumbnail(null);
        setNewThumbnailFile(null);
        setJob("BACKEND"); // Reset to default
        await fetchProjects();
      } else {
        // Handle other successful but unexpected statuses if necessary
        console.warn("Project creation returned unexpected status:", res.status, res.data);
        Alarm("❌", "프로젝트 생성에 실패했습니다.", "#FF1E1E", "#FFEAEA");
      }
    } catch (err) {
      console.error("Failed to create project:", err);
      if (err.response) {
        console.error("Server Error Data:", err.response.data);
        console.error("Server Error Status:", err.response.status);
      }
      Alarm("❌", "프로젝트 생성에 실패했습니다.", "#FF1E1E", "#FFEAEA");
    }
  };

  const fetchProjects = async () => {
    try {
      const token = Cookies.get("accessToken");
      console.log("Current Token:", token);

      const isTokenValid = token && token !== "logged-in";
      const headers = {
        "Accept": "application/json",
      };

      if (isTokenValid) {
        headers["Authorization"] = `Bearer ${token}`;
      } else if (token === "logged-in") {
        console.warn("Invalid legacy token detected. Clearing cookie.");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
      }

      const response = await axios.get(`${API_URL}/projects`, {
        headers: headers,
        withCredentials: true,
      });

      console.log("Fetched projects:", response.data);

      const data = response.data;
      if (Array.isArray(data)) {
        setProjects(data);
      } else if (data.data && Array.isArray(data.data)) {
        setProjects(data.data);
      } else {
        console.error("Projects data is not an array:", data);
        setProjects([]);
      }
    } catch (err) {
      console.error("Fetch Projects Error:", err);
      // Optional: Log server error response if available
      if (err.response) {
        console.error("Server Error Data:", err.response.data);
        console.error("Server Error Status:", err.response.status);
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
                    src="/assets/dummy-thumbnail.svg"
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
