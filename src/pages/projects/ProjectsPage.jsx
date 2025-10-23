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

  // 모달 열기
  const openModal = () => setIsModalOpen(true);
  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTitle("");
  };

  // 새 프로젝트 추가
  const handleAddProject = () => {
    if (newTitle.trim() === "") return alert("프로젝트 이름을 입력하세요!");

    const newProject = {
      id: projects.length + 1,
      title: newTitle,
      owner: "강장민",
      thumbnail: "/assets/dummy-thumbnail.svg",
      tasks: [],
    };

    setProjects([...projects, newProject]);
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
            <S.ModalTitle>새 프로젝트 만들기</S.ModalTitle>
            <S.Input
              type="text"
              placeholder="프로젝트 이름 입력"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <S.ButtonGroup>
              <S.CancelButton onClick={closeModal}>취소</S.CancelButton>
              <S.CreateButton onClick={handleAddProject}>생성</S.CreateButton>
            </S.ButtonGroup>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </>
  );
}
