import * as S from "./styles/profilePage";
import { Helmet } from "react-helmet";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import profiles from "@/data/profile";
import { API_URL, getImageUrl } from "@/constants/api";
import axios from "axios";
import Cookies from "js-cookie";
import { Alarm } from "@/toasts/Alarm";

const cToHex = (c) => Math.round(c).toString(16).padStart(2, "0");
const lerp = (a, b, t) => a + (b - a) * t;

const COLOR_STOPS = [
  { temp: 0, color: { r: 70, g: 120, b: 240 } },
  { temp: 15, color: { r: 100, g: 180, b: 240 } },
  { temp: 30, color: { r: 240, g: 200, b: 100 } },
  { temp: 36.5, color: { r: 255, g: 149, b: 43 } },
  { temp: 50, color: { r: 240, g: 120, b: 120 } },
  { temp: 75, color: { r: 245, g: 105, b: 105 } },
  { temp: 100, color: { r: 220, g: 60, b: 60 } },
];

const getTempColor = (currentValue, maxValue = 100) => {
  const value = parseFloat(currentValue) || 0;
  const max = parseFloat(maxValue);
  const temp = Math.min(Math.max(value, 0), max);

  const findColor = (idx) =>
    `#${cToHex(COLOR_STOPS[idx].color.r)}${cToHex(
      COLOR_STOPS[idx].color.g
    )}${cToHex(COLOR_STOPS[idx].color.b)}`;

  if (temp <= 0) return findColor(0);
  if (temp >= max) return findColor(COLOR_STOPS.length - 1);

  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    const stop1 = COLOR_STOPS[i];
    const stop2 = COLOR_STOPS[i + 1];

    if (temp >= stop1.temp && temp <= stop2.temp) {
      const t = (temp - stop1.temp) / (stop2.temp - stop1.temp);

      const r = lerp(stop1.color.r, stop2.color.r, t);
      const g = lerp(stop1.color.g, stop2.color.g, t);
      const b = lerp(stop1.color.b, stop2.color.b, t);

      return `#${cToHex(r)}${cToHex(g)}${cToHex(b)}`;
    }
  }
  return findColor(COLOR_STOPS.length - 1);
};

const Progress = (currentValue, maxValue) => {
  const value = parseFloat(currentValue);
  const max = parseFloat(maxValue);

  if (value < 0) return "0%";
  if (isNaN(value) || isNaN(max) || max <= 0) return "0%";

  const percentage = (value / max) * 100;
  return `${Math.min(percentage, 100)}%`;
};

// API major 값을 사용자 친화적인 이름으로 변환
const MAJOR_TO_DISPLAY = {
  "FRONTEND": "웹",
  "BACKEND": "서버",
  "ANDROID": "Android",
  "IOS": "iOS",
  "GAME": "게임",
  "DESIGN": "디자인"
};

// role 값이 시스템 역할인지 확인 (ROLE_DEVELOPER, ROLE_USER 등)
const isSystemRole = (role) => {
  if (!role) return false;
  return role.startsWith("ROLE_");
};

// major 또는 role을 표시용 직무명으로 변환
const getDisplayJob = (major, role) => {
  console.log("getDisplayJob called with:", { major, role });
  
  // major가 있으면 우선 사용
  if (major) {
    // major 값이 문자열인지 확인하고 trim
    const majorStr = String(major).trim();
    console.log("Checking major:", majorStr, "in MAJOR_TO_DISPLAY:", MAJOR_TO_DISPLAY[majorStr]);
    
    if (MAJOR_TO_DISPLAY[majorStr]) {
      console.log("Found display name:", MAJOR_TO_DISPLAY[majorStr]);
      return MAJOR_TO_DISPLAY[majorStr];
    }
    
    // 대소문자 무시하고 찾기
    const majorUpper = majorStr.toUpperCase();
    if (MAJOR_TO_DISPLAY[majorUpper]) {
      console.log("Found display name (uppercase):", MAJOR_TO_DISPLAY[majorUpper]);
      return MAJOR_TO_DISPLAY[majorUpper];
    }
    
    // 매핑에 없으면 원본 반환 (나중에 처리)
    console.log("Major not in mapping, returning original:", majorStr);
    return majorStr;
  }
  
  // major가 없고 role이 시스템 역할이 아니면 role 사용
  if (!major && role && !isSystemRole(role)) {
    console.log("Using role (not system role):", role);
    return role;
  }
  
  // 둘 다 없거나 시스템 역할만 있으면 빈 문자열
  console.log("No valid job found, returning empty string");
  return "";
};

export default function ProfilePage() {
  const { id } = useParams(); // URL 파라미터에서 id 가져오기
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null); // null로 초기화하여 로딩 상태 구분
  const [isLoading, setIsLoading] = useState(true);
  const [isMyProfile, setIsMyProfile] = useState(!id); // id가 없으면 내 프로필
  const [memberId, setMemberId] = useState(null); // 프로필 사용자의 memberId 저장
  
  console.log("ProfilePage rendered with id:", id);

  // 프로필 정보 조회
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get("accessToken");
      const headers = {
        "Accept": "application/json"
      };
      
      if (token && token !== "logged-in") {
        headers["Authorization"] = `Bearer ${token}`;
      }

      let response;
      let data = {};

      if (id) {
        // 다른 사용자의 프로필 조회 - 먼저 sessionStorage에서 개발자 정보 확인
        console.log("Fetching developer profile for ID:", id);
        let devData = null;
        let majorFromDevelopersList = null;
        let majorFromSessionStorage = null;
        
        // sessionStorage에서 개발자 정보 가져오기 (개발자 페이지에서 저장한 정보)
        try {
          const sessionInfo = sessionStorage.getItem('currentDeveloperInfo');
          if (sessionInfo) {
            const devInfo = JSON.parse(sessionInfo);
            if (String(devInfo.id) === String(id)) {
              console.log("Found developer info in sessionStorage:", devInfo);
              majorFromSessionStorage = devInfo.major;
              console.log("Major from sessionStorage:", majorFromSessionStorage);
            }
          }
        } catch (e) {
          console.warn("Failed to read sessionStorage:", e);
        }
        
        // 먼저 /auth/developers에서 전체 목록을 가져와서 해당 사용자 찾기
        try {
          const devsResponse = await axios.get(`${API_URL}/auth/developers`, {
            headers: headers,
            withCredentials: true
          });
          const devsData = devsResponse.data?.data || devsResponse.data || [];
          const devs = Array.isArray(devsData) ? devsData : [];
          console.log("All developers list:", devs);
          
          // id로 개발자 찾기 (id가 memberId일 수도 있고, 실제 id일 수도 있음)
          const foundDev = devs.find(dev => {
            const devId = dev.id;
            const devMemberId = dev.memberId;
            const searchId = typeof id === 'string' ? parseInt(id) : id;
            return devId === id || devId === searchId || 
                   devMemberId === id || devMemberId === searchId ||
                   String(devId) === String(id) || String(devMemberId) === String(id);
          });
          
          if (foundDev) {
            console.log("Found developer in list:", foundDev);
            console.log("Developer object keys:", Object.keys(foundDev));
            console.log("Developer.major:", foundDev.major);
            console.log("Developer full:", JSON.stringify(foundDev, null, 2));
            devData = foundDev;
            majorFromDevelopersList = foundDev.major || foundDev.Major || foundDev.job || majorFromSessionStorage;
            console.log("majorFromDevelopersList:", majorFromDevelopersList);
          }
        } catch (devsListError) {
          console.warn("Failed to fetch developers list:", devsListError);
        }
        
        // /developers/{id}도 시도 (없으면 위에서 찾은 정보 사용)
        if (!devData) {
          try {
            response = await axios.get(`${API_URL}/developers/${id}`, {
              headers: headers,
              withCredentials: true
            });
            
            // 스웨거 응답 구조 확인
            devData = response.data?.data || response.data;
            console.log("Developer API Response:", devData);
            console.log("Developer ID requested:", id);
            
            // devData가 비어있거나 유효하지 않으면 null로 설정
            if (!devData || (!devData.memberId && !devData.id)) {
              console.warn("Invalid developer data received:", devData);
              devData = null;
            }
          } catch (devError) {
            console.error("Failed to fetch developer:", devError);
            if (devError.response?.status === 404) {
              // 404 에러면 해당 사용자가 개발자로 등록되지 않았을 수 있음
              console.warn("Developer not found (404), trying profile endpoint");
              devData = null; // null로 설정하여 다음 단계로 진행
            } else {
              // 다른 에러는 계속 진행 (다른 엔드포인트 시도)
              console.warn("Developer fetch error, will try other endpoints:", devError);
              devData = null;
            }
          }
        }
        
        // 개발자 정보가 있으면 사용
        if (devData || majorFromDevelopersList) {
          const profileMemberId = devData?.memberId || id;
          setMemberId(profileMemberId); // memberId 저장
          data = {
            memberId: profileMemberId,
            major: devData?.major || majorFromDevelopersList, // 여러 소스에서 가져온 major 우선 사용
            introduction: devData?.introduction,
            career: devData?.career,
            githubId: devData?.githubId,
            blog: devData?.blog,
            temperature: devData?.temperature
          };
          
          console.log("Parsed developer data:", data);
          console.log("Developer major from API:", devData.major);
          
          // 사용자 기본 정보 가져오기 - memberId 사용
          // 주의: major는 개발자 정보에서 가져온 값을 유지해야 함
          try {
            // 먼저 /profile/{memberId} 시도
            const userResponse = await axios.get(`${API_URL}/profile/${profileMemberId}`, {
              headers: headers,
              withCredentials: true
            });
            const userData = userResponse.data?.data || userResponse.data || {};
            console.log("User profile data:", userData);
            console.log("Before merge - data.major:", data.major, "userData.major:", userData.major);
            // major는 개발자 정보에서 가져온 값을 우선 유지
            data = { 
              ...userData, 
              ...data, // 개발자 정보(major 포함)가 나중에 오도록 하여 덮어쓰기 방지
              major: data.major || userData.major // major는 개발자 정보 우선
            };
            console.log("After merge - data.major:", data.major);
            // major가 없으면 majorFromDevelopersList 사용
            if (!data.major && majorFromDevelopersList) {
              console.log("Using major from developers list:", majorFromDevelopersList);
              data.major = majorFromDevelopersList;
            }
          } catch (profileError) {
            console.warn("Failed to fetch from /profile/{memberId}, trying /auth/members:", profileError);
            // /auth/members에서 찾기
            try {
              const membersResponse = await axios.get(`${API_URL}/auth/members`, {
                headers: headers,
                withCredentials: true
              });
              const membersData = membersResponse.data?.data || membersResponse.data || {};
              const members = Array.isArray(membersData) ? membersData : (membersData.members || []);
              
              // memberId로 사용자 찾기 (숫자와 문자열 모두 비교)
              const member = members.find(m => {
                const mId = m.id || m.memberId;
                const searchId = typeof profileMemberId === 'string' ? parseInt(profileMemberId) : profileMemberId;
                return mId === profileMemberId || mId === searchId || String(mId) === String(profileMemberId);
              });
              
              if (member) {
                console.log("Found member:", member);
                console.log("Before merge with member - data.major:", data.major, "majorFromDevelopersList:", majorFromDevelopersList);
                
                // major는 개발자 정보에서 가져온 값을 우선 유지 (majorFromDevelopersList 포함)
                const finalMajor = data.major || majorFromDevelopersList;
                
                data = { 
                  ...data, // 개발자 정보(major 포함)를 먼저
                  username: member.username || data.githubId,
                  email: member.email || data.email || "",
                  profile: member.profile || data.profile,
                  role: member.role,
                  major: finalMajor // 개발자 정보의 major 우선 유지
                };
                console.log("After merge with member - data.major:", data.major);
              }
            } catch (userError) {
              console.warn("Failed to fetch user info:", userError);
            }
          }
        } else {
          // 개발자 정보가 없으면 /profile/{id} 직접 시도
          try {
            response = await axios.get(`${API_URL}/profile/${id}`, {
              headers: headers,
              withCredentials: true
            });
            const profileData = response.data?.data || response.data || {};
            console.log("Profile data from /profile/{id}:", profileData);
            
            // memberId 저장
            const profileMemberId = profileData.memberId || profileData.id || id;
            setMemberId(profileMemberId);
            
            // 프로필 데이터가 유효한지 확인
            if (profileData && (profileData.username || profileData.githubId || profileData.memberId || profileData.id)) {
              data = profileData;
            } else {
              console.warn("Invalid profile data received:", profileData);
              // /auth/members에서 찾기 시도
              try {
                const membersResponse = await axios.get(`${API_URL}/auth/members`, {
                  headers: headers,
                  withCredentials: true
                });
                const membersData = membersResponse.data?.data || membersResponse.data || {};
                const members = Array.isArray(membersData) ? membersData : (membersData.members || []);
                
                // id로 사용자 찾기 (숫자와 문자열 모두 비교)
                const member = members.find(m => {
                  const mId = m.id || m.memberId;
                  const searchId = typeof id === 'string' ? parseInt(id) : id;
                  return mId === id || mId === searchId || String(mId) === String(id);
                });
                
              if (member) {
                console.log("Found member from /auth/members:", member);
                const foundMemberId = member.id || member.memberId;
                setMemberId(foundMemberId);
                
                // major가 없으면 /auth/developers에서 해당 사용자의 개발자 정보 찾기
                let major = null;
                try {
                  const devsResponse = await axios.get(`${API_URL}/auth/developers`, {
                    headers: headers,
                    withCredentials: true
                  });
                  const devsData = devsResponse.data?.data || devsResponse.data || [];
                  const devs = Array.isArray(devsData) ? devsData : [];
                  const developerInfo = devs.find(dev => {
                    const devMemberId = dev.memberId || dev.id;
                    return devMemberId === foundMemberId || 
                           devMemberId === (typeof foundMemberId === 'string' ? parseInt(foundMemberId) : foundMemberId) ||
                           String(devMemberId) === String(foundMemberId);
                  });
                  
                  if (developerInfo && developerInfo.major) {
                    console.log("Found developer info with major:", developerInfo.major);
                    major = developerInfo.major;
                  }
                } catch (devsError) {
                  console.warn("Failed to fetch developers list:", devsError);
                }
                
                data = {
                  username: member.username,
                  email: member.email || "",
                  profile: member.profile,
                  role: member.role,
                  major: major,
                  memberId: foundMemberId
                };
              } else {
                throw new Error("Member not found");
              }
              } catch (memberError) {
                console.error("Failed to find member:", memberError);
                throw new Error("Profile not found");
              }
            }
          } catch (profileError) {
            console.error("Failed to fetch profile:", profileError);
            // 마지막으로 /auth/members에서 찾기 시도
            try {
              const membersResponse = await axios.get(`${API_URL}/auth/members`, {
                headers: headers,
                withCredentials: true
              });
              const membersData = membersResponse.data?.data || membersResponse.data || {};
              const members = Array.isArray(membersData) ? membersData : (membersData.members || []);
              
              const member = members.find(m => {
                const mId = m.id || m.memberId;
                const searchId = typeof id === 'string' ? parseInt(id) : id;
                return mId === id || mId === searchId || String(mId) === String(id);
              });
              
              if (member) {
                console.log("Found member as fallback:", member);
                const foundMemberId = member.id || member.memberId;
                setMemberId(foundMemberId);
                
                // major가 없으면 /auth/developers에서 해당 사용자의 개발자 정보 찾기
                let major = null;
                try {
                  const devsResponse = await axios.get(`${API_URL}/auth/developers`, {
                    headers: headers,
                    withCredentials: true
                  });
                  const devsData = devsResponse.data?.data || devsResponse.data || [];
                  const devs = Array.isArray(devsData) ? devsData : [];
                  const developerInfo = devs.find(dev => {
                    const devMemberId = dev.memberId || dev.id;
                    return devMemberId === foundMemberId || 
                           devMemberId === (typeof foundMemberId === 'string' ? parseInt(foundMemberId) : foundMemberId) ||
                           String(devMemberId) === String(foundMemberId);
                  });
                  
                  if (developerInfo && developerInfo.major) {
                    console.log("Found developer info with major:", developerInfo.major);
                    major = developerInfo.major;
                  }
                } catch (devsError) {
                  console.warn("Failed to fetch developers list:", devsError);
                }
                
                data = {
                  username: member.username,
                  email: member.email || "",
                  profile: member.profile,
                  role: member.role,
                  major: major,
                  memberId: foundMemberId
                };
              } else {
                throw profileError;
              }
            } catch (finalError) {
              throw profileError;
            }
          }
        }
        
        // memberId가 아직 설정되지 않았으면 id로 설정
        if (!memberId && id) {
          setMemberId(id);
        }
      } else {
        // 내 프로필 조회
        response = await axios.get(`${API_URL}/auth/me`, {
          headers: headers,
          withCredentials: true
        });
        data = response.data?.data || response.data || {};
      }

      // API 응답을 UI 형식으로 변환
      if (data && (data.username || data.githubId || data.memberId || data.id)) {
        console.log("Setting user profile with data:", data);
        const userName = data.username || data.githubId || data.name || (data.memberId ? `개발자 ${data.memberId}` : `개발자 ${id}`);
        console.log("Final user name:", userName);
        console.log("Data keys:", Object.keys(data));
        console.log("Username from data:", data.username);
        console.log("GithubId from data:", data.githubId);
        
        // major가 없으면 sessionStorage에서 확인 (최종 시도)
        // 내 프로필이 아닐 때만 sessionStorage 확인
        let finalMajor = data.major;
        if (id) {
          // 다른 사용자 프로필일 때만 sessionStorage 확인
          finalMajor = data.major || majorFromSessionStorage;
          
          if (!finalMajor) {
          console.log("⚠️ Major not found in data, trying /auth/developers one more time with id:", id);
          try {
            const token = Cookies.get("accessToken");
            const headers = {
              "Accept": "application/json"
            };
            if (token && token !== "logged-in") {
              headers["Authorization"] = `Bearer ${token}`;
            }
            
            const devsResponse = await axios.get(`${API_URL}/auth/developers`, {
              headers: headers,
              withCredentials: true
            });
            const devsData = devsResponse.data?.data || devsResponse.data || [];
            const devs = Array.isArray(devsData) ? devsData : [];
            console.log("Final attempt - All developers count:", devs.length);
            
            // 여러 방법으로 찾기 (id, memberId 모두 시도)
            const searchId = typeof id === 'string' ? parseInt(id) : id;
            const memberIdToSearch = data.memberId || id;
            
            const foundDev = devs.find(dev => {
              const devId = dev.id;
              const devMemberId = dev.memberId;
              
              return devId === id || devId === searchId || 
                     devMemberId === id || devMemberId === searchId ||
                     devId === memberIdToSearch || devMemberId === memberIdToSearch ||
                     String(devId) === String(id) || String(devMemberId) === String(id) ||
                     String(devId) === String(memberIdToSearch) || String(devMemberId) === String(memberIdToSearch);
            });
            
            if (foundDev) {
              console.log("✅ FOUND DEVELOPER in final attempt:", foundDev);
              console.log("Developer object keys:", Object.keys(foundDev));
              console.log("Developer full object:", JSON.stringify(foundDev, null, 2));
              
              // /auth/developers 응답에 major가 없으므로, /developers/{id} API 재시도
              // 하지만 500 에러가 발생했으므로, 개발자 페이지에서 이미 가져온 정보를 확인
              // 또는 다른 방법으로 major 정보 가져오기
              
              // 일단 /developers/{id} API를 다시 시도 (다른 파라미터나 헤더로)
              try {
                const devDetailResponse = await axios.get(`${API_URL}/developers/${foundDev.id || id}`, {
                  headers: headers,
                  withCredentials: true
                });
                const devDetail = devDetailResponse.data?.data || devDetailResponse.data;
                console.log("Developer detail from /developers/{id}:", devDetail);
                
                if (devDetail && devDetail.major) {
                  console.log("✅ FOUND MAJOR from /developers/{id}:", devDetail.major);
                  finalMajor = devDetail.major;
                  data.major = devDetail.major;
                }
              } catch (devDetailError) {
                console.warn("Failed to fetch developer detail, trying alternative approach:", devDetailError);
                
                // 개발자 페이지에서 이미 표시된 정보 확인
                // localStorage나 sessionStorage에 저장되어 있을 수 있음
                // 또는 개발자 페이지 컴포넌트에서 전달받을 수 있음
                
                // 임시 해결책: 개발자 페이지에서 카드에 표시된 job 정보 활용
                // 하지만 이건 현재 불가능하므로, API 구조 확인 필요
                console.warn("Cannot get major from /developers/{id} API. Please check API response structure.");
              }
            } else {
              console.warn("❌ Developer not found in /auth/developers list");
            }
          } catch (error) {
            console.warn("Final attempt to find major failed:", error);
          }
          }
        } else {
          // 내 프로필일 때는 /auth/me 응답의 major를 그대로 사용
          finalMajor = data.major;
          console.log("My profile - using major from /auth/me:", finalMajor);
        }
        
        // 직무 표시명 변환 (major 우선, 시스템 role 무시)
        console.log("=== JOB CONVERSION DEBUG ===");
        console.log("data.major:", data.major);
        console.log("finalMajor:", finalMajor);
        console.log("data.role:", data.role);
        
        const displayJob = getDisplayJob(finalMajor || data.major, data.role);
        console.log("getDisplayJob result:", displayJob);
        
        // 이미지 URL 처리 및 로깅
        const rawImagePath = data.profile || data.profileImage;
        const processedImageUrl = getImageUrl(rawImagePath);
        console.log("=== IMAGE URL DEBUG ===");
        console.log("Raw image path from API:", rawImagePath);
        console.log("Processed image URL:", processedImageUrl);
        console.log("=== END IMAGE URL DEBUG ===");
        
        const profileData = {
          id: userName,
          email: data.email || "",
          job: displayJob || finalMajor || data.major || "", // 최대한 많은 소스에서 시도
          img: processedImageUrl || "/assets/profile-icon.svg",
          CompletedProjects: String(data.career || data.completedProjects || 0),
          Temp: String(data.temperature || data.temp || 0),
          projectList: data.projectList || [],
          introduction: data.introduction || "",
          githubId: data.githubId || "",
          blog: data.blog || ""
        };
        
        console.log("Final job value:", profileData.job);
        console.log("=== END JOB CONVERSION DEBUG ===");
        
        console.log("Final profile data:", profileData);
        setUserProfile(profileData);
      } else {
        console.warn("No valid data received from API:", data);
        // 기본값 대신 에러 메시지와 함께 빈 프로필 표시
        Alarm("⚠️", "프로필 정보를 불러올 수 없습니다.", "#FF9800", "#FFF3E0");
        // 임시 프로필 데이터 생성 (기본값 사용하지 않음)
        setUserProfile({
          id: id ? `개발자 ${id}` : "사용자",
          email: "",
          job: "",
          img: "/assets/profile-icon.svg",
          CompletedProjects: "0",
          Temp: "0",
          projectList: [],
          introduction: "",
          githubId: "",
          blog: ""
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      if (error.response) {
        console.error("Server Error Data:", error.response.data);
        console.error("Server Error Status:", error.response.status);
        const status = error.response.status;
        if (status === 404) {
          Alarm("❌", "프로필을 찾을 수 없습니다.", "#FF1E1E", "#FFEAEA");
        } else {
          Alarm("❌", "프로필을 불러오지 못했습니다.", "#FF1E1E", "#FFEAEA");
        }
      } else {
        Alarm("❌", "네트워크 오류가 발생했습니다.", "#FF1E1E", "#FFEAEA");
      }
      // 에러 시 빈 프로필 표시 (기본값 사용하지 않음)
      setUserProfile({
        id: id ? `개발자 ${id}` : "사용자",
        email: "",
        job: "",
        img: "/assets/profile-icon.svg",
        CompletedProjects: "0",
        Temp: "0",
        projectList: [],
        introduction: "",
        githubId: "",
        blog: ""
      });
    } finally {
      setIsLoading(false);
    }
  }, [id]); // id를 의존성으로 추가

  useEffect(() => {
    setIsMyProfile(!id);
    setIsLoading(true);
    setUserProfile(null); // 초기화 - 이전 데이터 제거
    fetchProfile();
  }, [id, fetchProfile]); // id와 fetchProfile이 변경될 때마다 다시 조회

  // 프로필 로드 후 LocalStorage에서 최신 직무 가져오기 (내 프로필일 때만)
  // 주의: localStorage 값은 사용자 친화적인 이름(웹, 서버 등)이므로 그대로 사용
  useEffect(() => {
    if (!id && userProfile && !isLoading) {
      const storedJob = localStorage.getItem("userJob");
      // localStorage에 값이 있고, 현재 프로필에 직무가 없거나 다르면 업데이트
      if (storedJob && (!userProfile.job || storedJob !== userProfile.job)) {
        setUserProfile((prevProfile) => ({
          ...prevProfile,
          job: storedJob, // localStorage 값은 이미 사용자 친화적인 이름
        }));
      }
    }
  }, [id, userProfile, isLoading]);

  // 로딩 중이거나 프로필이 없으면 로딩 표시
  if (isLoading || !userProfile) {
    return (
      <>
        <Helmet>
          <title>Devit</title>
          <link rel="icon" href="./assets/Helmet.svg"></link>
        </Helmet>
        <S.Container>
          <S.Frame>
            <div style={{ padding: "50px", textAlign: "center" }}>로딩 중...</div>
          </S.Frame>
        </S.Container>
      </>
    );
  }

  const profile = userProfile; // 이제 상태(state)에서 정보를 가져옵니다.
  const projectsCountValue = parseFloat(profile?.CompletedProjects ?? "");
  const tempValueValue = parseFloat(profile?.Temp ?? "");

  const projectsCount = isNaN(projectsCountValue)
    ? "0"
    : String(projectsCountValue);
  const tempValue = isNaN(tempValueValue) ? "0" : String(tempValueValue);

  const completedProjectsWidth = Progress(projectsCount, 20);
  const tempWidth = Progress(tempValue, 100);
  const tempColor = getTempColor(tempValue, 100);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    try {
      const token = Cookies.get("accessToken");
      if (!token || token === "logged-in") {
        Alarm("❌", "로그인이 필요합니다.", "#FF1E1E", "#FFEAEA");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      };

      // 스웨거 스펙: PUT /auth/profile/image
      const response = await axios.put(`${API_URL}/auth/profile/image`, formData, {
        headers: headers,
        withCredentials: true
      });

      // 스웨거 응답: { "status": 0, "data": {} }
      if (response.status === 200) {
        const newImageUrl = URL.createObjectURL(file);
        
        // 로컬 상태 업데이트
        setUserProfile((prevProfile) => ({
          ...prevProfile,
          img: newImageUrl,
        }));

        Alarm("✅", "프로필 사진이 변경되었습니다.", "#3CAF50", "#E8F5E9");
        
        // 프로필 다시 조회하여 서버에서 최신 이미지 URL 가져오기
        await fetchProfile();
      }
    } catch (error) {
      console.error("Failed to upload profile image:", error);
      if (error.response) {
        console.error("Server Error Data:", error.response.data);
        console.error("Server Error Status:", error.response.status);
      }
      Alarm("❌", "프로필 사진 변경에 실패했습니다.", "#FF1E1E", "#FFEAEA");
    }

    event.target.value = null;
  };

  // 채팅방 생성 및 이동
  const handleStartChat = async () => {
    if (!memberId || !id) {
      Alarm("❌", "사용자 정보를 찾을 수 없습니다.", "#FF1E1E", "#FFEAEA");
      return;
    }

    try {
      const token = Cookies.get("accessToken");
      if (!token || token === "logged-in") {
        Alarm("❌", "로그인이 필요합니다.", "#FF1E1E", "#FFEAEA");
        navigate("/signin");
        return;
      }

      // 다른 API 요청과 동일한 헤더 구조 사용
      const headers = {
        "Accept": "application/json"
      };
      
      if (token && token !== "logged-in") {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // 채팅방 생성 시도 (여러 엔드포인트 시도)
      let chatRoomId = null;
      const targetMemberId = memberId;

      console.log("=== CHAT ROOM CREATION DEBUG ===");
      console.log("Target memberId:", targetMemberId);
      console.log("Current user profile:", userProfile);

      // 먼저 기존 채팅방이 있는지 확인
      try {
        console.log("Checking existing rooms first...");
        const roomsResponse = await axios.get(`${API_URL}/chat/rooms/my-rooms`, {
          headers,
          withCredentials: true
        });
        const roomsData = roomsResponse.data?.data || roomsResponse.data || [];
        const rooms = Array.isArray(roomsData) ? roomsData : [];
        console.log("Existing rooms:", rooms);
        
        // 해당 사용자와의 채팅방 찾기
        const existingRoom = rooms.find(room => {
          // 다양한 방법으로 매칭 시도
          if (room.members && Array.isArray(room.members)) {
            return room.members.some(m => 
              String(m.id) === String(targetMemberId) || 
              String(m.memberId) === String(targetMemberId)
            );
          }
          if (room.memberIds && Array.isArray(room.memberIds)) {
            return room.memberIds.includes(targetMemberId) || 
                   room.memberIds.some(id => String(id) === String(targetMemberId));
          }
          if (room.partnerId) {
            return String(room.partnerId) === String(targetMemberId);
          }
          if (room.name && userProfile.id) {
            return room.name === userProfile.id || room.name.includes(userProfile.id);
          }
          return false;
        });
        
        if (existingRoom) {
          chatRoomId = existingRoom.id || existingRoom.roomId;
          console.log("✅ Found existing room:", chatRoomId);
        }
      } catch (roomsError) {
        console.warn("Failed to check existing rooms:", roomsError);
      }

      // 기존 채팅방이 없으면 새로 생성
      // 스웨거에 따르면 1:1 채팅방은 GET /chat/rooms/private/{memberId}로 조회/생성
      if (!chatRoomId) {
        try {
          console.log(`🔍 Trying 1:1 chat room API: GET /chat/rooms/private/${targetMemberId}`);
          const privateRoomResponse = await axios.get(
            `${API_URL}/chat/rooms/private/${targetMemberId}`,
            {
              headers,
              withCredentials: true
            }
          );
          
          console.log("✅ 1:1 chat room response:", privateRoomResponse);
          const roomData = privateRoomResponse.data?.data || privateRoomResponse.data || {};
          chatRoomId = roomData.id || roomData.roomId;
          
          if (chatRoomId) {
            console.log(`✅✅ 1:1 chat room found/created:`, chatRoomId);
            Alarm("✅", "채팅방이 생성되었습니다.", "#3CAF50", "#E8F5E9");
          }
        } catch (privateRoomError) {
          console.warn("1:1 chat room API failed, trying POST /chat/rooms:", privateRoomError);
          
          // GET 실패 시 POST /chat/rooms 시도 (memberIds 배열 사용)
          // 500 에러가 발생하면 서버 로그 확인 필요
          try {
            // 현재 사용자 ID 가져오기 (필요할 수 있음)
            let currentUserId = null;
            try {
              const meResponse = await axios.get(`${API_URL}/auth/me`, {
                headers,
                withCredentials: true
              });
              const meData = meResponse.data?.data || meResponse.data || {};
              currentUserId = meData.id || meData.memberId;
              console.log("Current user ID for chat room:", currentUserId);
            } catch (meError) {
              console.warn("Failed to get current user ID:", meError);
            }

            console.log(`🔄 Trying POST /chat/rooms with memberIds array`);
            console.log("Request payload:", {
              name: "",
              description: "",
              type: "PRIVATE",
              memberIds: [Number(targetMemberId)]
            });
            
            const requestBody = {
              name: "",
              description: "",
              type: "PRIVATE",
              memberIds: [Number(targetMemberId)]
            };
            
            // 현재 사용자 ID를 명시적으로 포함 (백엔드가 자동 추가하더라도 명시적으로 포함)
            if (currentUserId && !requestBody.memberIds.includes(Number(currentUserId))) {
              requestBody.memberIds.push(Number(currentUserId));
              console.log("Added current user ID to memberIds:", currentUserId);
            }
            
            const postResponse = await axios.post(
              `${API_URL}/chat/rooms`,
              requestBody,
              {
                headers: {
                  ...headers,
                  "Content-Type": "application/json"
                },
                withCredentials: true
              }
            );
            
            console.log("✅ POST /chat/rooms response:", postResponse);
            console.log("✅ Response status:", postResponse.status);
            console.log("✅ Response data:", JSON.stringify(postResponse.data, null, 2));
            
            const roomData = postResponse.data?.data || postResponse.data || {};
            chatRoomId = roomData.id || roomData.roomId;
            
            if (chatRoomId) {
              console.log(`✅✅ Chat room created via POST:`, chatRoomId);
              Alarm("✅", "채팅방이 생성되었습니다.", "#3CAF50", "#E8F5E9");
            } else {
              console.warn("⚠️ Response received but no roomId found:", roomData);
            }
          } catch (postError) {
            console.error("❌ POST /chat/rooms failed:", postError);
            if (postError.response) {
              console.error("Error status:", postError.response.status);
              console.error("Error data:", JSON.stringify(postError.response.data, null, 2));
              console.error("Error headers:", postError.response.headers);
              
              // 500 에러는 서버 내부 오류 - 서버 로그 확인 필요
              if (postError.response.status === 500) {
                const errorMsg = postError.response.data?.message || 
                                postError.response.data?.code || 
                                "서버 내부 오류가 발생했습니다.";
                Alarm(
                  "❌", 
                  `서버 오류: ${errorMsg}`,
                  "#FF1E1E", 
                  "#FFEAEA"
                );
                console.error("Full error response:", JSON.stringify(postError.response.data, null, 2));
              }
            } else {
              console.error("Network error:", postError.message);
            }
          }
        }
      }

      console.log("=== END CHAT ROOM CREATION DEBUG ===");

      // 채팅 페이지로 이동 (채팅방 ID가 있으면 전달)
      if (chatRoomId) {
        console.log("Navigating to chat room:", chatRoomId);
        navigate(`/chat?roomId=${chatRoomId}`);
        Alarm("✅", "채팅방으로 이동합니다.", "#3CAF50", "#E8F5E9");
      } else {
        console.warn("No chat room ID found, navigating to chat page without roomId");
        // 채팅방 ID가 없어도 채팅 페이지로 이동 (채팅 페이지에서 목록 조회 후 선택)
        navigate("/chat");
        Alarm("⚠️", "채팅방을 생성하지 못했습니다. 채팅 페이지로 이동합니다.", "#FF9800", "#FFF3E0");
      }
    } catch (error) {
      console.error("Failed to start chat:", error);
      
      // CORS 오류 명확히 표시
      if (!error.response && (error.message?.includes("CORS") || error.message?.includes("Network Error"))) {
        Alarm(
          "⚠️", 
          "CORS 오류: 백엔드 서버의 CORS 설정을 확인해주세요. 채팅 페이지로 이동합니다.",
          "#FF9800", 
          "#FFF3E0"
        );
        navigate("/chat");
        return;
      }
      
      if (error.response) {
        console.error("Server Error Data:", error.response.data);
        console.error("Server Error Status:", error.response.status);
        if (error.response.status === 404) {
          Alarm("❌", "채팅방을 생성할 수 없습니다.", "#FF1E1E", "#FFEAEA");
        } else {
          Alarm("❌", "채팅방 생성에 실패했습니다.", "#FF1E1E", "#FFEAEA");
        }
      } else {
        // 네트워크 에러가 있어도 채팅 페이지로 이동 시도
        navigate("/chat");
        Alarm("⚠️", "네트워크 오류가 발생했습니다. 채팅 페이지로 이동합니다.", "#FF9800", "#FFF3E0");
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="./assets/Helmet.svg"></link>
      </Helmet>
      <S.Container>
        <S.Frame>
          <S.ProfileText>프로필</S.ProfileText>
          <S.ProfileGrid>
            <S.Profile>
              <S.ProfileInfo>
                <S.ImgContainer>
                  <S.ProfileImg 
                    src={profile.img || "/assets/profile-icon.svg"} 
                    alt="프로필 이미지"
                    onError={(e) => {
                      console.error("Profile image failed to load:", profile.img);
                      if (e.target.src !== "/assets/profile-icon.svg") {
                        e.target.src = "/assets/profile-icon.svg";
                      }
                    }}
                    onLoad={() => {
                      console.log("Profile image loaded successfully:", profile.img);
                    }}
                  />
                  <S.CameraIcon src="/assets/camera-icon.svg" />
                </S.ImgContainer>
                <S.NameContainer>
                  <S.Name>{profile.id}</S.Name>
                  <S.Job>{profile.job}</S.Job>
                </S.NameContainer>
              </S.ProfileInfo>
              {isMyProfile && (
                <S.EditButton>
                  프로필 변경
                  <S.ProfileButton
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </S.EditButton>
              )}
              <S.PersonalInfo>
                <S.EmailInfo>
                  <S.Email>이메일</S.Email>
                  <S.PersonalEmail>{profile.email || "이메일 없음"}</S.PersonalEmail>
                </S.EmailInfo>
                {profile.introduction && (
                  <S.EmailInfo style={{ marginTop: "15px" }}>
                    <S.Email>소개</S.Email>
                    <S.PersonalEmail>{profile.introduction}</S.PersonalEmail>
                  </S.EmailInfo>
                )}
                {profile.githubId && (
                  <S.EmailInfo style={{ marginTop: "15px" }}>
                    <S.Email>GitHub</S.Email>
                    <S.PersonalEmail>
                      <a 
                        href={`https://github.com/${profile.githubId}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: "#883CBE", textDecoration: "none" }}
                      >
                        {profile.githubId}
                      </a>
                    </S.PersonalEmail>
                  </S.EmailInfo>
                )}
                {profile.blog && (
                  <S.EmailInfo style={{ marginTop: "15px" }}>
                    <S.Email>블로그</S.Email>
                    <S.PersonalEmail>
                      <a 
                        href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: "#883CBE", textDecoration: "none" }}
                      >
                        {profile.blog}
                      </a>
                    </S.PersonalEmail>
                  </S.EmailInfo>
                )}
              </S.PersonalInfo>
            </S.Profile>
            <S.TopRight>
              <S.StatBox>
                <S.StatValue>{projectsCount}</S.StatValue>
                <S.StatLabel>완료한 프로젝트</S.StatLabel>
                <S.ProgressBarContainer>
                  <S.ProgressBar
                    width={completedProjectsWidth}
                    color="#4D96FF"
                  />
                </S.ProgressBarContainer>
              </S.StatBox>
              <S.StatBox>
                <S.StatValue>{tempValue}°C</S.StatValue>
                <S.StatLabel>온도</S.StatLabel>
                <S.ProgressBarContainer>
                  <S.ProgressBar width={tempWidth} color={tempColor} />
                </S.ProgressBarContainer>
              </S.StatBox>
            </S.TopRight>

            <S.BottomRight>
              <S.SectionTitle>프로젝트 목록</S.SectionTitle>
              <S.ProjectList>
                {profile.projectList.length > 0 ? (
                  profile.projectList.map((project, index) => (
                    <S.ProjectItem key={index}>
                      <S.ProjectName>{project.name}</S.ProjectName>
                      <S.ProjectPoints>{project.points}</S.ProjectPoints>
                    </S.ProjectItem>
                  ))
                ) : (
                  <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
                    프로젝트가 없습니다.
                  </div>
                )}
              </S.ProjectList>
              {!isMyProfile && (
                <S.ChatButton onClick={handleStartChat}>
                  이 개발자와 소통하러 가기
                </S.ChatButton>
              )}
            </S.BottomRight>
          </S.ProfileGrid>
        </S.Frame>
      </S.Container>
    </>
  );
}
