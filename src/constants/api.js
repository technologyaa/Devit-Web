// API URL에서 마지막 슬래시 제거
const rawApiUrl = import.meta.env.VITE_API_URL || '';
export const API_URL = rawApiUrl.replace(/\/+$/, '');

// WebSocket URL 생성 (http -> ws, https -> wss)
const getWebSocketUrl = () => {
  const apiUrl = rawApiUrl.replace(/\/+$/, '');
  if (apiUrl.startsWith('https://')) {
    return apiUrl.replace('https://', 'wss://');
  } else if (apiUrl.startsWith('http://')) {
    return apiUrl.replace('http://', 'ws://');
  }
  // 기본값 (개발 환경)
  return `ws://${apiUrl.replace(/^\/\//, '')}`;
};

export const WS_URL = getWebSocketUrl();

// 이미지 URL 처리 (상대 경로를 절대 경로로 변환)
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "/assets/profile-icon.svg";
  
  // 이미 전체 URL인 경우 그대로 반환
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // /assets/로 시작하는 경우 (로컬 이미지) 그대로 반환
  if (imagePath.startsWith('/assets/')) {
    return imagePath;
  }
  
  // uploads/ 또는 다른 상대 경로인 경우 API_URL과 조합
  if (imagePath.startsWith('uploads/') || imagePath.startsWith('/uploads/')) {
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${API_URL}${cleanPath}`;
  }
  
  // 그 외의 경우 API_URL과 조합 (프로필 이미지 등)
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_URL}${cleanPath}`;
};
