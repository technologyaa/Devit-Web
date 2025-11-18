const storedJob = localStorage.getItem("userJob") || "의뢰인";

const profiles = [
  {
    id: "사용자",
    job: storedJob,
    email: "hello@technologyaa.com",
    img: "/assets/profile-icon.svg",
    CompletedProjects: "2",
    Temp: "65",
    credit: "12,500",
    projectList: [
      { name: "서비스 Devit의 홈 화면 디자인", points: "+300" },
      { name: "서비스 Devit의 서버 구축", points: "+2400" },
    ],
  },
];

export default profiles;
