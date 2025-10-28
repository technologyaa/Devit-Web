import * as S from "./styles/projectsPage";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { projectList as initialProjects } from "@/data/projectList";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(initialProjects);

  // 모달 관련 state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newThumbnail, setNewThumbnail] = useState(null);

  // 모달 열기
  const openModal = () => setIsModalOpen(true);
  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTitle("");
    setNewThumbnail(null);
  };

  // 파일 업로드 처리
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setNewThumbnail(imageURL);
    }
  };

  // 새 프로젝트 추가
  const handleAddProject = () => {
    if (newTitle.trim() === "") return alert("프로젝트 이름을 입력하세요!");

    const newProject = {
      id: projects.length + 1,
      title: newTitle,
      owner: "사용자",
      thumbnail: newThumbnail || "/assets/dummy-thumbnail.svg",
      tasks: [],
    };

    initialProjects.push(newProject);
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
            프로젝트
            <S.PlusButton
              src="/assets/plus-icon.svg"
              alt="플러스 아이콘"
              onClick={openModal}
            />
          </S.Top>

          <S.Bottom>
            {projects.map((project) => (
              <S.Box
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <S.Thumbnail
                  src={project.thumbnail}
                  alt={`${project.title} 썸네일`}
                />
                <S.BoxBottom>
                  <S.Title>{project.title}</S.Title>
                  <S.Owner>{project.owner}</S.Owner>
                </S.BoxBottom>
              </S.Box>
            ))}
          </S.Bottom>
        </S.Frame>
      </S.Container>

      {/* 모달 */}
      {isModalOpen && (
        <S.ModalOverlay onClick={closeModal}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalWrapper>
              <S.ModalTitle>새 프로젝트 만들기</S.ModalTitle>

              {/* 프로젝트 이름 */}
              <S.ProjectInputBox>
                <S.ProjectInputText>프로젝트</S.ProjectInputText>
                <S.ProjectInput
                  type="text"
                  placeholder="프로젝트 이름 입력"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </S.ProjectInputBox>

              {/* 프로젝트 사진 업로드 */}
              <S.ProjectPictureBox>
                <S.ProjectPictureText>프로젝트 사진</S.ProjectPictureText>

                {/* label 클릭 시 파일 탐색창 열림 */}
                <S.ProjectPictureLabel htmlFor="project-file">
                  <S.ProjectPicture
                    src={newThumbnail || "./assets/picture-upload.svg"}
                    alt="업로드 미리보기"
                  />
                </S.ProjectPictureLabel>

                {/* 실제 파일 input (숨김) */}
                <S.ProjectPictureInput
                  id="project-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </S.ProjectPictureBox>

              {/* 버튼 */}
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
