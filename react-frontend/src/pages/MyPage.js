import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/MyPage.css";
import defaultProfileImg from "../assets/images/default_profile.png";


const MyPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8050";

  const [stats, setStats] = useState({ posts: 0, comments: 0, favorites: 0, likes: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentComments, setRecentComments] = useState([]);
  const [recentFavorites, setRecentFavorites] = useState([]);
  const [recentLikes, setRecentLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchMyPage = async () => {
      setLoading(true);
      setError(null);
      try {
        const [postsRes, commentsRes, favoritesRes, likesRes, statsRes] = await Promise.all([
          api.get(`/api/mypage/${user.userSeq}/posts?limit=5&preview=true`),
          api.get(`/api/mypage/${user.userSeq}/comments?limit=5&preview=true`),
          api.get(`/api/mypage/${user.userSeq}/favorites?limit=5&preview=true`),
          api.get(`/api/mypage/${user.userSeq}/likes?limit=5&preview=true`),
          api.get(`/api/mypage/${user.userSeq}/stats`),
        ]);
        setRecentPosts(postsRes.data);
        setRecentComments(commentsRes.data);
        setRecentFavorites(favoritesRes.data);
        setRecentLikes(likesRes.data);
        setStats(statsRes.data);
      } catch {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPage();
  }, [user]);

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout();
      navigate("/");
    }
  };

  if (!user) return <div className="mypage-container">로그인이 필요합니다.</div>;
  if (loading) return <div className="mypage-container">로딩 중...</div>;
  if (error) return <div className="mypage-container">{error}</div>;

  return (
    <div className="mypage-container">
      <div className="mypage-header">
        <img
          src={user.profileImage ? `${SERVER_BASE_URL}${user.profileImage}` : defaultProfileImg}
          alt="프로필"
          className="profile-image"
        />
        <div className="user-info">
          <h2>{user.nickname}</h2>
          <div className="mypage-header-buttons">
            <button className="edit-btn" onClick={() => navigate("/mypage/myinfo")}>
              프로필 수정
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <Stat label="작성 글" count={stats.posts} />
        <Stat label="댓글 수" count={stats.comments} />
        <Stat label="즐겨찾기" count={stats.favorites} />
        <Stat label="좋아요" count={stats.likes} />
      </div>

      <RecentSection title="작성한 글" items={recentPosts} type="post" onMore={() => navigate("/mypage/myposts")} />
      <RecentSection title="작성한 댓글" items={recentComments} type="comment" onMore={() => navigate("/mypage/mycomments")} />
      <RecentSection title="즐겨찾기한 글" items={recentFavorites} type="post" onMore={() => navigate("/mypage/myfavorites")} />
      <RecentSection title="좋아요 누른 글" items={recentLikes} type="post" onMore={() => navigate("/mypage/mylikes")} />
    </div>
  );
};

const Stat = ({ label, count }) => (
  <div className="stat-card">
    <div className="stat-count">{count}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const RecentSection = ({ title, items, type, onMore }) => {
  const navigate = useNavigate();

  const handleClickItem = (item) => navigate(`/posts/${item.postSeq}`);

  return (
    <div className="section">
      <h3>{title}</h3>
      {items.length === 0 ? (
        <p>표시할 항목이 없습니다.</p>
      ) : (
        <ul className="preview-list">
          {items.map((item) => (
            <li key={type === "post" ? item.postSeq : item.commentSeq} onClick={() => handleClickItem(item)} className="clickable">
              <div className="preview-title">{type === "post" ? item.title : `"${item.content}"`}</div>
              <div className="preview-date">{formatDate(item.createdAt)}</div>
            </li>
          ))}
        </ul>
      )}
      <button className="more-btn" onClick={onMore}>더보기</button>
    </div>
  );
};

const formatDate = (timestamp) => new Date(timestamp).toISOString().split("T")[0];

export default MyPage;
