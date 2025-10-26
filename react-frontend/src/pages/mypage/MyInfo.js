import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/MyInfo.css";

const MyInfo = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || "");
      setPreviewImage(user.profileImage || "/default-profile.png");
    }
  }, [user]);

  // 기존 handleImageChange 교체
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) return alert("이미지 용량이 10MB를 초과했습니다.");

    // 서버 업로드
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/api/posts/upload", formData, { withCredentials: true });
      // 서버에서 받은 이미지 URL로 미리보기 업데이트
      setPreviewImage(res.data.imageUrl);
      setProfileImageFile(file); // 선택된 파일 상태 유지
    } catch {
      alert("이미지 업로드 실패");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken"); // 로그인 후 저장된 토큰

    if (!nickname.trim()) return setMessage("닉네임을 입력해주세요.");
    if (newPassword && newPassword.length < 6)
      return setMessage("새 비밀번호는 최소 6자 이상이어야 합니다.");

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append(
        "user",
        new Blob(
          [JSON.stringify({ userSeq: user.userSeq, nickname, currentPassword, newPassword })],
          { type: "application/json" }
        )
      );

      if (profileImageFile) formData.append("profileImage", profileImageFile);

      await api.put(`/api/mypage/${user.userSeq}/myinfo`, formData, {
        headers: { "Content-Type": "multipart/form-data",
                   Authorization: `Bearer ${token}`,
        },
      });

      if (newPassword) {
        // 비밀번호를 변경한 경우에만 로그아웃
        alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
        logout();
        navigate("/login");
      } else {
        // 닉네임/프로필 사진만 변경한 경우
        alert("프로필이 수정되었습니다.");
        navigate("/mypage");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "프로필 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="mypage-info-container">로그인이 필요합니다.</div>;

  return (
    <div className="mypage-info-container">
      <h2>프로필 수정</h2>
      <form className="mypage-edit-form" onSubmit={handleSubmit}>
        <div className="mypage-form-group">
          <label>아이디</label>
          <input type="text" value={user.userId} disabled />
        </div>

        <div className="mypage-form-group">
          <label>프로필 사진</label>
          <img src={previewImage} alt="미리보기" className="mypage-profile-preview" />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="mypage-form-group">
          <label>닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>

        <div className="mypage-form-group">
          <label>현재 비밀번호</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className="mypage-form-group">
          <label>새 비밀번호 (선택)</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {message && <p className="mypage-error-message">{message}</p>}

        <button type="submit" disabled={loading} className="mypage-submit-btn">
          {loading ? "저장 중..." : "저장"}
        </button>
      </form>
    </div>
  );
};

export default MyInfo;
