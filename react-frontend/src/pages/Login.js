import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!id || !password) {
      setErrorMsg("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const user = await login(id, password);
      alert(`환영합니다, ${user.nickname}님!`);
      navigate("/");
    } catch {
      setErrorMsg("아이디 또는 비밀번호가 잘못되었습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>로그인</h2>

        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        {errorMsg && <div className="error-msg">{errorMsg}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <p className="signup-link" onClick={() => navigate("/signup")}>
        계정이 없으신가요? 회원가입
      </p>
    </div>
  );
}

export default Login;
