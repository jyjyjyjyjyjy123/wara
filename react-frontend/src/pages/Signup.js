import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!id || !password || !nickname) {
      setErrorMsg("모든 항목을 입력해주세요.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await api.post("/api/auth/signup", { userId: id, password, nickname });
      const user = await login(id, password);

      alert(`환영합니다, ${user.nickname}님!`);
      navigate("/");
    } catch (error) {
      if (error.response?.data) setErrorMsg(error.response.data);
      else setErrorMsg("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <h2>회원가입</h2>

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
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          disabled={loading}
        />

        {errorMsg && <div className="error-msg">{errorMsg}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </form>

      <p className="login-link" onClick={() => navigate("/login")}>
        이미 계정이 있으신가요? 로그인
      </p>
    </div>
  );
}

export default Signup;
