import * as S from "./styles/homePage";
import { Helmet } from "react-helmet";
import devlopers from "@/data/developer-list";
import icons from "@/data/icon-list";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "@/constants/api";
import { Alarm } from "@/toasts/Alarm";

const jobList = [
  { id: 1, name: "웹", icon: "/assets/job-icons/web.svg" },
  { id: 2, name: "서버", icon: "/assets/job-icons/server.svg" },
  { id: 3, name: "Android", icon: "/assets/job-icons/android.svg" },
  { id: 4, name: "iOS", icon: "/assets/job-icons/ios.svg" },
  { id: 5, name: "게임", icon: "/assets/job-icons/game.svg" },
  { id: 6, name: "디자인", icon: "/assets/job-icons/design.svg" },
];

export default function HomePage() {
  // 1. 초기값은 false (API 확인 전에는 모달 닫힘 상태)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [intro, setIntro] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  // 2. 페이지 로드 시 서버에 '내 정보'가 있는지 확인
  useEffect(() => {
    // 로컬에 완료 플래그가 있으면 건너뜁니다.
    if (localStorage.getItem("profileCompleted") === "true") return;

    // 재시도 로직: 로그인 직후 쿠키가 아직 설정되지 않았을 수 있어
    // 짧게 여러 번 토큰을 확인합니다.
    let attempts = 0;
    const maxAttempts = 6; // 약 3초 동안 재시도
    const delayMs = 500;

    const tryCheck = async () => {
      attempts += 1;
      const token = Cookies.get("accessToken");

      if (!token) {
        if (attempts < maxAttempts) setTimeout(tryCheck, delayMs);
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        // 2-1. 로그인된 유저의 기본 ID 조회
        const meRes = await axios.get(`${API_URL}/auth/me`, { headers, withCredentials: true });
        const memberId = meRes.data?.data?.memberId || meRes.data?.memberId || meRes.data?.data?.id || meRes.data?.id;

        if (memberId) {
          try {
            // 2-2. 개발자 상세 정보 조회 시도
            await axios.get(`${API_URL}/developers/${memberId}`, { headers, withCredentials: true });
            // 이미 등록된 유저 -> 플래그 세팅
            localStorage.setItem("profileCompleted", "true");
          } catch (error) {
            if (error.response && error.response.status === 404) {
              console.log("신규 유저 감지: 팝업 오픈");
              setIsModalOpen(true);
            } else {
              console.warn("개발자 정보 조회 중 에러 (모달 오픈):", error);
              setIsModalOpen(true);
            }
          }
        }
      } catch (e) {
        console.error("유저 프로필 확인 중 오류:", e);
      }
    };

    tryCheck();
  }, []);

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

    // 우선 로컬 저장
    localStorage.setItem("userJob", selectedJob);
    localStorage.setItem("userIntro", intro);

    (async () => {
      try {
        const token = Cookies.get("accessToken");
        const headers = { Accept: "application/json" };
        if (token && token !== "logged-in") headers["Authorization"] = `Bearer ${token}`;

        let memberId = null;
        let githubId = null;

        // memberId 다시 확보
        try {
          const meRes = await axios.get(`${API_URL}/auth/me`, {
            headers,
            withCredentials: true,
          });
          const meData = meRes.data?.data || meRes.data || {};
          memberId = meData.memberId || meData.id || null;
          githubId = meData.githubId || meData.username || null;
        } catch (meErr) {
          console.warn("Auth check failed", meErr);
        }

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
            // 개발자 정보 생성 요청
            await axios.post(`${API_URL}/developers/${memberId}`, body, {
              headers: { ...headers, "Content-Type": "application/json" },
              withCredentials: true,
            });
            
            Alarm("💾", "서버에 정보가 저장되었습니다.", "#4CAF50", "#E8F5E9");
            localStorage.setItem("profileCompleted", "true");
            setIsModalOpen(false); // 저장 성공 시 모달 닫기
            
          } catch (postErr) {
            console.error("개발자 생성 API 실패:", postErr);
            Alarm("⚠️", "서버 저장에 실패했습니다.", "#F44336", "#FFEBEE");
            // 실패 시 모달 유지
          }
        } else {
            // memberId가 없는 경우 (예외 상황)
            setIsModalOpen(false);
        }
      } catch (e) {
        console.error(e);
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
      
      {/* 모달: isModalOpen이 true일 때만 표시 */}
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