// API URL에서 마지막 슬래시 제거
const rawApiUrl = import.meta.env.VITE_API_URL || '';
export const API_URL = rawApiUrl.replace(/\/+$/, '');
