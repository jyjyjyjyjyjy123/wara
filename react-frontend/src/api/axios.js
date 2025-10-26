// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

// 요청 인터셉터: 토큰 첨부 (skipAuth 옵션 허용)
api.interceptors.request.use(
  (config) => {
    if (!config.skipAuth) {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 에러 객체가 충분치 않으면 그대로 reject
    if (!error.response) return Promise.reject(error);

    const status = error.response.status;
    const data = error.response.data;
    // 서버에서 보내는 message 구조에 맞춰 안전하게 읽기
    const message = (data && (data.message || data)) ? (data.message || data).toString() : "";

    // 예외 메시지 목록: 이 메시지들일 때는 "로그아웃" 시그널로 보지 않음
    const ignoreLogoutMessages = [
      "현재 비밀번호가 일치하지 않습니다",
      "비밀번호가 잘못되었습니다",
      // 필요 시 더 추가
    ];
    const isIgnored = ignoreLogoutMessages.some((m) => message.includes(m));

    // 인증 관련 에러 처리: 401 또는 403
    if ((status === 401 || status === 403) && !error.config?.skipAuth && !isIgnored) {
      // 토큰 제거 (AuthContext 쪽에서도 타이머 정리)
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // 유저에게 알려주고 로그인으로 이동
      // (alert는 한 번만 발생하도록 AuthContext의 타이머나 axios에서 처리)
      try {
        // window.location으로 페이지 이동 (React navigate는 여기서 접근 불편)
        window.location.href = "/login";
      } catch (e) {
        console.error("redirect failed", e);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
