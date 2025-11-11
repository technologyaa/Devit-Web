export const chatList = [
  {
    id: 1,
    userName: "강장민",
    userProfile: "/assets/jang.svg",
    lastMessage: "바로 만들어드릴게요",
    lastTime: "2025-11-11T08:43:00",
    messages: [
      {
        id: 1,
        sender: "강장민",
        content: "안녕하세요.",
        time: "2025-11-11T08:10:00",
        isMine: false, // false면 상대방, true면 내가 보낸 메시지
      },
      {
        id: 2,
        sender: "나",
        content: "안녕하세요",
        time: "2025-11-11T08:10:10",
        isMine: false,
      },
      {
        id: 3,
        sender: "나",
        content:
          "제가 Devit이라는 서비스를 디자인하고 싶은데 홈 화면 디자인해주실 수 있나요?",
        time: "2025-11-11T08:11:00",
        isMine: true,
      },
      {
        id: 4,
        sender: "강장민",
        content: "홈에는 무슨 내용이 있을까요?",
        time: "2025-11-11T08:12:00",
        isMine: false,
      },
      {
        id: 5,
        sender: "나",
        content:
          "대시보드 느낌으로 해주면 좋을 것 같아요.\n이 서비스에는 기본적으로 채팅, 개발자, 프로필 섹션이 있습니다.",
        time: "2025-11-11T08:13:30",
        isMine: true,
      },
      {
        id: 6,
        sender: "나",
        content: "devit.com/projects/23",
        time: "2025-11-11T08:14:00",
        isMine: true,
      },
      {
        id: 7,
        sender: "강장민",
        content: "바로 만들어드릴게요",
        time: "2025-11-11T08:15:00",
        isMine: false,
      },
    ],
  },
  {
    id: 2,
    userName: "웹준",
    userProfile: "/assets/dummy-profile.svg",
    lastMessage: "장강민은 바보 멍청이 입니다 ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ",
    lastTime: "2025-11-10T17:00:00",
    messages: [],
  },
];
