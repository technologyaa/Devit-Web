import * as S from "./styles/homePage";
import { Helmet } from "react-helmet";
import devlopers from "@/data/developer-list";
import icons from "@/data/icon-list";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "@/constants/api";
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
  const [isModalOpen, setIsModalOpen] = useState(() => {
    try {
      return localStorage.getItem("profileCompleted") !== "true";
    } catch (e) {
      return true;
    }
  });
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

    (async () => {
      try {
        // 현재 로그인된 사용자 정보 조회 (/auth/me)
        const token = Cookies.get("accessToken");
        const headers = { Accept: "application/json" };
        if (token && token !== "logged-in") headers["Authorization"] = `Bearer ${token}`;

        let memberId = null;
        let githubId = null;

        try {
          const meRes = await axios.get(`${API_URL}/auth/me`, {
            headers,
            withCredentials: true,
          });
          const meData = meRes.data?.data || meRes.data || {};
          memberId = meData.memberId || meData.id || null;
          githubId = meData.githubId || meData.username || null;
        } catch (meErr) {
          console.warn("/auth/me 조회 실패, memberId를 가져오지 못했습니다:", meErr);
        }

        // memberId가 있으면 개발자 생성 API 호출
        if (memberId) {
          const JOB_TO_MAJOR = {
            웹: "FRONTEND",
            서버: "BACKEND",
            Android: "ANDROID",
            iOS: "IOS",
            게임: "GAME",
            디자인: "DESIGN",
          };

          const body = {
            introduction: intro,
            career: 0,
            githubId: githubId || "",
            major: JOB_TO_MAJOR[selectedJob] || "BACKEND",
            blog: "",
          };

          try {
            await axios.post(`${API_URL}/developers/${memberId}`, body, {
              headers: { ...headers, "Content-Type": "application/json" },
              withCredentials: true,
            });
            console.log("개발자 생성 API 호출 성공", memberId, body);
            Alarm("💾", "서버에 정보가 저장되었습니다.", "#4CAF50", "#E8F5E9");
            localStorage.setItem("profileCompleted", "true");
          } catch (postErr) {
            console.error("개발자 생성 API 실패:", postErr);
            Alarm("⚠️", "서버 저장에 실패했습니다.", "#F44336", "#FFEBEE");
            // 그래도 모달은 닫아 사용자 경험을 방해하지 않음
            localStorage.setItem("profileCompleted", "true");
          }
        } else {
          // memberId를 얻지 못한 경우 로컬에 완료 플래그만 세팅
          localStorage.setItem("profileCompleted", "true");
          console.warn("memberId가 없어 서버에 개발자 생성 요청을 보내지 않았습니다.");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsModalOpen(false);
      }
    })();
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
