import * as S from "./styles/taskDetailPage";
import { Helmet } from "react-helmet";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { projectList } from "@/data/project-list";
import { Alarm } from "@/toasts/Alarm";

export default function TaskDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { task, projectId } = location.state || {}; // projectId 전달 필수

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const moreClicked = () => setIsMoreOpen((prev) => !prev);

  // ✅ 업무 삭제
  const handleDeleteTask = () => {
    const project = projectList.find((p) => p.id === +projectId);
    if (!project)
      return Alarm("‼️", "프로젝트를 찾을 수 없습니다.", "#FF1E1E", "#FFEAEA");

    const taskIndex = project.tasks.findIndex((t) => t.id === task.id);
    if (taskIndex === -1)
      return Alarm("‼️", "업무를 찾을 수 없습니다.", "#FF1E1E", "#FFEAEA");

    project.tasks.splice(taskIndex, 1);
    Alarm("🗑️", "업무가 삭제되었습니다.", "#FF1E1E", "#FFEAEA");

    navigate(`/projects/${projectId}`); // 삭제 후 프로젝트 상세 페이지로 이동
  };

  if (!task.files) task.files = [];
  const [files, setFiles] = useState(task.files);
  const [isDone, setIsDone] = useState(task?.isDone ?? false);
  const [isSubmitted, setIsSubmitted] = useState(task?.isDone ?? false);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((f) => task.files.push(f));
  };

  const handleRemoveFile = (index) => {
    if (isSubmitted) return;
    setFiles((prev) => {
      const newFiles = [...prev];
      const removed = newFiles.splice(index, 1)[0];
      if (removed.preview) URL.revokeObjectURL(removed.preview);
      task.files.splice(index, 1);
      return newFiles;
    });
  };

  const handleSubmit = () => {
    if (!isSubmitted) {
      if (files.length === 0) return;
      setIsSubmitted(true);
      setIsDone(true);
      task.isDone = true;
    } else {
      setIsSubmitted(false);
      setIsDone(false);
      task.isDone = false;
    }
  };

  return (
    <>
      <Helmet>
        <title>Devit</title>
      </Helmet>

      <S.Container>
        <S.Frame>
          <S.Top>
            <S.TopWrapper>
              <S.TopLeft>
                <S.BackIcon
                  onClick={() => navigate(-1)}
                  src="/assets/back-icon.svg"
                />
                <S.ProjectText>{task?.title}</S.ProjectText>
                <S.TaskStatus isDone={isDone}>
                  {isDone ? "완료" : "미완료"}
                </S.TaskStatus>
              </S.TopLeft>

              <S.ProjectSettingsIcon
                src="/assets/more-icon.svg"
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
                    업무 설정
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
            <S.DescriptionText>{task?.description}</S.DescriptionText>

            <S.SubmitBox>
              <S.SubmitBoxTop>
                <S.SubmitText>업무</S.SubmitText>
                <S.SubmitPrice>가격: 1,000</S.SubmitPrice>
              </S.SubmitBoxTop>

              {files.length > 0 && (
                <S.FilePreviewArea>
                  {files.map((item, index) => (
                    <S.FileBox key={index} isSubmitted={isSubmitted}>
                      {item.preview ? (
                        <S.Thumbnail src={item.preview} alt={item.file.name} />
                      ) : (
                        <S.FileIcon src="/assets/file-icon.svg" alt="file" />
                      )}
                      <S.FileName>{item.file.name}</S.FileName>
                      <S.RemoveFileButton
                        isSubmitted={isSubmitted}
                        onClick={() => handleRemoveFile(index)}
                      >
                        ✕
                      </S.RemoveFileButton>
                    </S.FileBox>
                  ))}
                </S.FilePreviewArea>
              )}

              <S.SubmitBoxBottom>
                <S.UploadButton>
                  추가
                  <S.FileInput
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    disabled={isSubmitted}
                  />
                </S.UploadButton>

                <S.SubmitButton onClick={handleSubmit}>
                  {isSubmitted ? "수정하기" : "제출하기"}
                </S.SubmitButton>
              </S.SubmitBoxBottom>
            </S.SubmitBox>
          </S.Bottom>
        </S.Frame>
      </S.Container>

      {/* 삭제 모달 */}
      {isDeleteModalOpen && (
        <S.ModalOverlay onClick={closeDeleteModal}>
          <S.DeleteModalContent onClick={(e) => e.stopPropagation()}>
            <S.DeleteModalWrapper>
              <S.ModalTitle>업무 삭제</S.ModalTitle>
              <S.WarningText>
                <strong>{task.title}</strong>를 삭제하시겠습니까?
              </S.WarningText>
              <S.ButtonGroup>
                <S.CancelButton onClick={closeDeleteModal}>취소</S.CancelButton>
                <S.DeleteButton onClick={handleDeleteTask}>삭제</S.DeleteButton>
              </S.ButtonGroup>
            </S.DeleteModalWrapper>
          </S.DeleteModalContent>
        </S.ModalOverlay>
      )}
    </>
  );
}
