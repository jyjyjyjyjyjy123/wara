// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const _clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const logout = () => {
    _clearAuth();
    window.location.href = "/login";
  };

  const login = async (id, password) => {
    const res = await api.post("/api/auth/login", { id, password }, { skipAuth: true });
    const data = res.data;

    const token = data.token;
    if (!token) throw new Error("서버에서 토큰을 받지 못했습니다.");

    let expMs = null;
    try {
      const decoded = jwtDecode(token);
      if (decoded && decoded.exp) {
        expMs = decoded.exp * 1000; // 밀리초
      }
    } catch (e) {
      console.warn("토큰 디코드 실패", e);
    }

    const userData = {
      token,
      userId: data.userId,
      userSeq: data.userSeq,
      nickname: data.nickname,
      profileImage: data.profileImage,
      exp: expMs,
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  // 새로고침 시 초기 상태 검사
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      // 만료 여부만 체크, 강제 로그아웃은 하지 않음
      setUser(parsed);
    } catch (e) {
      _clearAuth();
    }
  }, []);

  // 토큰 만료 여부 확인 함수 (API 요청 시 체크 가능)
  const isTokenExpired = () => {
    if (!user?.exp) return false;
    return user.exp < Date.now();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isTokenExpired }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
