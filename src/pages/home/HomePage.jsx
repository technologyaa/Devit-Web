import * as S from "./styles/homePage";
import { Helmet } from "react-helmet";
import icons from "@/data/icon-list";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
// [이미지 처리 함수]
import { API_URL, getImageUrl } from "@/constants/api";
import { Alarm } from "@/toasts/Alarm";
import { useNavigate } from "react-router-dom";

const jobList = [
  { id: 1, name: "웹", icon: "/assets/job-icons/web.svg" },
  { id: 2, name: "서버", icon: "/assets/job-icons/server.svg" },
  { id: 3, name: "Android", icon: "/assets/job-icons/android.svg" },
  { id: 4, name: "iOS", icon: "/assets/job-icons/ios.svg" },
  { id: 5, name: "게임", icon: "/assets/job-icons/game.svg" },
  { id: 6, name: "디자인", icon: "/assets/job-icons/design.svg" },
];

export default function HomePage() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [intro, setIntro] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [recommendDevelopers, setRecommendDevelopers] = useState([]);

  // 1. 내 프로필 등록 여부 확인
  useEffect(() => {
    if (localStorage.getItem("profileCompleted") === "true") return;

    let attempts = 0;
    const maxAttempts = 6;
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
        const meRes = await axios.get(`${API_URL}/auth/me`, { headers, withCredentials: true });
        const memberId = meRes.data?.data?.memberId || meRes.data?.memberId || meRes.data?.data?.id || meRes.data?.id;

        if (memberId) {
          try {
            await axios.get(`${API_URL}/developers/${memberId}`, { headers, withCredentials: true });
            localStorage.setItem("profileCompleted", "true");
          } catch (error) {
            if (error.response && error.response.status === 404) {
              setIsModalOpen(true);
            } else {
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

  // 2. 추천 개발자 목록 가져오기 + 랜덤 섞기
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await axios.get(`${API_URL}/developers`);

        // 데이터 구조 파싱 (data.data 또는 data.developers 등 대응)
        let raw = response.data;
        let data = [];

        if (Array.isArray(raw)) data = raw;
        else if (raw && Array.isArray(raw.data)) data = raw.data;
        else if (raw && raw.data && Array.isArray(raw.data.developers)) data = raw.data.developers;
        else data = raw.developers || [];

        // [랜덤 섞기]
        const shuffledData = [...(data || [])].sort(() => Math.random() - 0.5);
        setRecommendDevelopers(shuffledData);
      } catch (error) {
        console.error("개발자 목록 로드 실패:", error);
      }
    };
    fetchDevelopers();
  }, []);

  const handleDevClick = (developerId) => {
    navigate(`/profile/${developerId}`);
  };

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

    (async () => {
      try {
        const token = Cookies.get("accessToken");
        const headers = { Accept: "application/json" };
        if (token && token !== "logged-in") headers["Authorization"] = `Bearer ${token}`;

        let memberId = null;
        let githubId = null;

        try {
          const meRes = await axios.get(`${API_URL}/auth/me`, { headers, withCredentials: true });
          const meData = meRes.data?.data || meRes.data || {};
          memberId = meData.memberId || meData.id || null;
          githubId = meData.githubId || meData.username || null;
        } catch (e) { }

        if (memberId) {
          const JOB_TO_MAJOR = {
            웹: "FRONTEND", 서버: "BACKEND", Android: "ANDROID",
            iOS: "IOS", 게임: "GAME", 디자인: "DESIGN",
          };

          const body = {
            introduction: intro, career: 0, githubId: githubId || "",
            major: JOB_TO_MAJOR[selectedJob] || "BACKEND", blog: "",
          };

          try {
            await axios.post(`${API_URL}/developers/${memberId}`, body, {
              headers: { ...headers, "Content-Type": "application/json" },
              withCredentials: true,
            });
            Alarm("💾", "서버에 정보가 저장되었습니다.", "#4CAF50", "#E8F5E9");
            localStorage.setItem("profileCompleted", "true");
            setIsModalOpen(false);
          } catch (postErr) {
            Alarm("⚠️", "서버 저장에 실패했습니다.", "#F44336", "#FFEBEE");
          }
        } else {
          setIsModalOpen(false);
        }
      } catch (e) { console.error(e); }
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
                {icons.map((icon, index) => (
                  <S.styledLink to={icon.url} key={index}>
                    <S.Card gradient={icon.gradient}>
                      <S.ElementPlace>
                        <S.IconButton>
                          <S.Icon src={icons[index].logo} alt="아이콘"></S.Icon>
                          <S.Button>바로 가기</S.Button>
                        </S.IconButton>
                        <S.ElementName>{icons[index].name}</S.ElementName>
                        <S.ElementInfo>{icons[index].text}</S.ElementInfo>
                      </S.ElementPlace>
                    </S.Card>
                  </S.styledLink>
                )
                )}
              </S.Goto>
            </S.Middle>
          </S.TopMiddleWrap>

          <S.Bottom>
            <S.Text>추천 개발자</S.Text>
            <S.RecommendDev>
              {(() => {
                const displayRecommend = [];
                // 섞인 데이터에서 6명 추출
                for (let i = 0; i < 6; i++) {
                  const real = recommendDevelopers[i];
                  if (real) {
                    displayRecommend.push({ ...real, _isPlaceholder: false });
                  } else {
                    displayRecommend.push({
                      _isPlaceholder: true,
                      developerId: `placeholder-${i}`,
                      nickname: "등록된 개발자 없음",
                      major: "",
                      introduction: "",
                      temperature: null,
                    });
                  }
                }

                return displayRecommend.map((dev, index) => {
                  const devId = dev.developerId || dev.memberId || dev.id || `dev-${index}`;

                  // [사진 문제 해결] 가능한 모든 키 확인
                  const rawImg = dev.profileImage || dev.profileUrl || dev.img || dev.imageUrl || dev.profile;
                  // getImageUrl을 통해 전체 경로 생성
                  const profileImg = (dev._isPlaceholder || !rawImg)
                    ? "/assets/dummy-profile.svg"
                    : getImageUrl(rawImg);

                  // 이름 및 직무
                  const name = dev.nickname || dev.githubId || dev.username || (dev._isPlaceholder ? "" : "Unknown");
                  const job = dev.major || dev.Major || "";

                  // [자기소개 문제 해결] 가능한 모든 키 확인 + 글자수 제한
                  const rawIntro = dev.introduction || dev.intro || dev.bio || dev.selfIntroduction || "";
                  const introText = rawIntro.length > 15 ? rawIntro.substring(0, 15) + "..." : rawIntro;

                  const tempValRaw = dev.temperature || dev.devTemperature || dev.temp || null;
                  const tempVal = tempValRaw != null ? Number(tempValRaw) : null;

                  return (
                    <S.Devloper
                      key={dev._isPlaceholder ? dev.developerId : devId || index}
                      onClick={() => {
                        if (!dev._isPlaceholder) handleDevClick(devId);
                      }}
                      style={{ cursor: dev._isPlaceholder ? "default" : "pointer" }}
                    >
                      <S.ProfileWrapper>
                        <S.Profile
                          src={profileImg}
                          alt="프로필"
                          onError={(e) => {
                            if (e.target.src.indexOf("/assets/dummy-profile.svg") === -1) {
                              e.target.src = "/assets/dummy-profile.svg";
                            }
                          }}
                        />
                        {tempVal != null && (
                          <S.TemperatureBar $temp={tempVal} />
                        )}
                      </S.ProfileWrapper>

                      <S.DevAndJob>
                        <S.NameAndJobText FontSize={"clamp(16px, 1.2vw, 20px)"} FontWeight={"440"}>
                          {dev._isPlaceholder ? "" : name}
                        </S.NameAndJobText>
                        <S.NameAndJobText FontSize={"clamp(14px, 1vw, 18px)"}>
                          {dev._isPlaceholder ? "" : job}
                        </S.NameAndJobText>
                      </S.DevAndJob>

                      {/* [수정됨] FontSize 1px -> 12px (이제 보일 겁니다) */}
                      <S.NameAndJobText FontSize={"15px"} TextColor={"#747474"}>
                        {introText}
                      </S.NameAndJobText>
                    </S.Devloper>
                  );
                });
              })()}
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
                <S.ProjectInput type="text" placeholder="한 줄로 나를 소개해보세요!" value={intro} onChange={(e) => setIntro(e.target.value)} />
              </S.ProjectInputBox>
              <S.JobFrame>
                <S.ProjectInputText>직무</S.ProjectInputText>
                <S.JobSelectGrid>
                  {jobList.map((job) => (
                    <S.JobBox key={job.id} isSelected={selectedJob === job.name} onClick={() => setSelectedJob(job.name)}>
                      <S.JobIcon src={job.icon} alt={`${job.name} 아이콘`} />
                      <span>{job.name}</span>
                      {selectedJob === job.name && <S.CheckIcon src="/assets/job-icons/check.svg" alt="선택됨" />}
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