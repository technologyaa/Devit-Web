import * as S from "./styles/taskDetailPage";
import { Helmet } from "react-helmet";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function TaskDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { task } = location.state || {};

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDeleteProject = () => {
    const index = projectList.findIndex((p) => p.id === +projectId);
    if (index !== -1) {
      projectList.splice(index, 1);
      Alarm("🗑️", "업무가 삭제되었습니다.", "#FF1E1E", "#FFEAEA");
      navigate("/tasks");
    } else {
      Alarm("‼️", "업무를 찾을 수 없습니다.", "#FF1E1E", "#FFEAEA");
    }
  };

  // task.files 초기화
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

  const moreClicked = () => {
    setIsMoreOpen((prevIsMoreOpen) => !prevIsMoreOpen);
  };

  const handleSubmit = () => {
    if (!isSubmitted) {
      if (files.length === 0) return; // 파일 없으면 제출 불가
      setIsSubmitted(true);
      setIsDone(true);
      task.isDone = true; // task 객체 완료 반영
    } else {
      setIsSubmitted(false);
      setIsDone(false); // 수정 시 미완료로
      task.isDone = false;
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
                alt="프로젝트 설정 아이콘"
                onClick={moreClicked}
              />
              {isMoreOpen && (
                <S.MoreBox>
                  <S.MoreItem
                    onClick={() =>
                      Alarm(
                        "‼️",
                        "업무 이름을 입력하세요.",
                        "#FF1E1E",
                        "#FFEAEA"
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
                    disabled={isSubmitted} // 제출 후 추가 막기
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
