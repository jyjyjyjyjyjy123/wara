// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // 로그인 상태가 아니면 로그인 페이지로 리다이렉트
    return <Navigate to="/login" replace />;
  }

  // 로그인 상태면 해당 페이지 그대로 렌더링
  return children;
};

export default ProtectedRoute;
