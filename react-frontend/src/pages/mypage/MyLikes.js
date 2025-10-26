import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/MyPageMore.css";

const ITEMS_PER_PAGE = 15;

const MyLikes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user) return;

    const fetchLikes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(
          `/api/mypage/${user.userSeq}/likes?page=${page}&limit=${ITEMS_PER_PAGE}`
        );

        const data = res.data;
        if (data && Array.isArray(data.like)) {
          setLikes(data.like);
          setTotalPages(Math.ceil(data.totalCount / ITEMS_PER_PAGE));
        } else {
          throw new Error("좋아요 데이터가 없습니다.");
        }
      } catch (err) {
        console.error(err);
        setError("좋아요 목록을 불러오는 중 오류가 발생했습니다.");
        setLikes([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [user, page]);

  const handleClickLike = (post) => navigate(`/posts/${post.postSeq}`);
  const goToPrevPage = () => page > 1 && setPage(page - 1);
  const goToNextPage = () => page < totalPages && setPage(page + 1);

  if (!user) return <div className="mypage-more-container">로그인이 필요합니다.</div>;
  if (loading) return <div className="mypage-more-container">로딩 중...</div>;
  if (error) return <div className="mypage-more-container">{error}</div>;

  return (
    <div className="mypage-more-container">
      <h2>좋아요 누른 글</h2>

      {likes.length === 0 ? (
        <p className="mypage-more-empty">좋아요 누른 글이 없습니다.</p>
      ) : (
        <>
          <ul className="mypage-more-list">
            {likes.map((post) => (
              <li
                key={post.postSeq}
                className="mypage-more-item clickable"
                onClick={() => handleClickLike(post)}
              >
                <div className="mypage-more-title">{post.title}</div>
                <div className="mypage-more-date">{formatDate(post.createdAt)}</div>
              </li>
            ))}
          </ul>

          <div className="mypage-more-pagination">
            <button onClick={goToPrevPage} disabled={page === 1}>이전</button>
            <span>{page} / {totalPages}</span>
            <button onClick={goToNextPage} disabled={page === totalPages}>다음</button>
          </div>
        </>
      )}
    </div>
  );
};

const formatDate = (ts) => new Date(ts).toISOString().split("T")[0];

export default MyLikes;
