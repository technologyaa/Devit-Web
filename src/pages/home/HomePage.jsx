import * as S from "./styles/homePage";
import { Helmet } from "react-helmet";
import devlopers from "@/data/developer-list";
import icons from "@/data/icon-list";
import { useState } from "react";
import { Alarm } from "@/toasts/Alarm";

const gradients = {};

const jobList = [
  { id: 1, name: "웹", icon: "/assets/job-icons/web.svg" },
  { id: 2, name: "서버", icon: "/assets/job-icons/server.svg" },
  { id: 3, name: "Android", icon: "/assets/job-icons/android.svg" },
  { id: 4, name: "iOS", icon: "/assets/job-icons/ios.svg" },
  { id: 5, name: "게임", icon: "/assets/job-icons/game.svg" },
  { id: 6, name: "디자인", icon: "/assets/job-icons/design.svg" },
];

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [intro, setIntro] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setIntro("");
    setSelectedJob(null);
  };

  const complete = () => {
    if (!selectedJob) {
      Alarm("⚠️", "직무를 선택해주세요.", "#FF9800", "#FFF3E0");
      return;
    }

    localStorage.setItem("userJob", selectedJob);
    localStorage.setItem("userIntro", intro);

    console.log("선택한 직무:", selectedJob);
    console.log("소개:", intro);
    Alarm("💾", "정보가 저장되었습니다.", "#4CAF50", "#E8F5E9");
    setIsModalOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="./assets/Helmet.svg" />
      </Helmet>
      <S.Container>
        <S.Frame>
          <S.TopMiddleWrap>
            <S.Top>
              <S.Name>
                <S.NameText TextColor={"#883CBE"}>개발</S.NameText>과{" "}
                <S.NameText TextColor={"#D4AAF3"}>기획</S.NameText>을 잇다
              </S.Name>
              <S.Cricle1></S.Cricle1>
              <S.Cricle2></S.Cricle2>
            </S.Top>
            <S.Middle>
              <S.Text>바로가기</S.Text>
              <S.Goto>
                {icons.map((icon, index) => {
                  return (
                    <S.styledLink to={icon.url} key={index}>
                      <S.Card gradient={icon.gradient}>
                        <S.ElementPlace>
                          <S.IconButton>
                            <S.Icon
                              src={icons[index].logo}
                              alt="프로젝트바로가기 아이콘"
                            ></S.Icon>
                            <S.Button>바로 가기</S.Button>
                          </S.IconButton>
                          <S.ElementName>{icons[index].name}</S.ElementName>
                          <S.ElementInfo>{icons[index].text}</S.ElementInfo>
                        </S.ElementPlace>
                      </S.Card>
                    </S.styledLink>
                  );
                })}
              </S.Goto>
            </S.Middle>
          </S.TopMiddleWrap>
          <S.Bottom>
            <S.Text>추천 개발자</S.Text>
            <S.RecommendDev>
              {devlopers.map((devloper, index) => {
                return (
                  <S.Devloper key={index}>
                    <S.Profile
                      src="./assets/dummy-profile.svg"
                      alt="개발자 프로필"
                    ></S.Profile>

                    <S.DevAndJob>
                      <S.NameAndJobText
                        FontSize={"clamp(16px, 1.2vw, 20px)"}
                        FontWeight={"440"}
                      >
                        {devloper.name}
                      </S.NameAndJobText>
                      <S.NameAndJobText FontSize={"clamp(14px, 1vw, 18px)"}>
                        {devloper.job}
                      </S.NameAndJobText>
                    </S.DevAndJob>

                    <S.NameAndJobText FontSize={"12px"} TextColor={"#747474"}>
                      {devloper.text}
                    </S.NameAndJobText>
                  </S.Devloper>
                );
              })}
            </S.RecommendDev>
          </S.Bottom>
        </S.Frame>
      </S.Container>
      {isModalOpen && (
        <S.ModalOverlay>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalWrapper>
              <S.ModalTitle>전공·직무 선택 후 한 줄 소개 작성</S.ModalTitle>

              <S.ProjectInputBox>
                <S.ProjectInputText>소개</S.ProjectInputText>
                <S.ProjectInput
                  type="text"
                  placeholder="한 줄로 나를 소개해보세요!"
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                />
              </S.ProjectInputBox>
              <S.JobFrame>
                <S.ProjectInputText>직무</S.ProjectInputText>
                <S.JobSelectGrid>
                  {jobList.map((job) => (
                    <S.JobBox
                      key={job.id}
                      isSelected={selectedJob === job.name}
                      onClick={() => setSelectedJob(job.name)}
                    >
                      <S.JobIcon src={job.icon} alt={`${job.name} 아이콘`} />

                      <span>{job.name}</span>

                      {selectedJob === job.name && (
                        <S.CheckIcon
                          src="/assets/job-icons/check.svg"
                          alt="선택됨"
                        />
                      )}
                    </S.JobBox>
                  ))}
                </S.JobSelectGrid>
              </S.JobFrame>

              <S.ButtonGroup>
                <S.CreateButton onClick={complete}>완료</S.CreateButton>
              </S.ButtonGroup>
            </S.ModalWrapper>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </>
  );
}
