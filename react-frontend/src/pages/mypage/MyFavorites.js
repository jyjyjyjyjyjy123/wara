import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/MyPageMore.css";

const ITEMS_PER_PAGE = 15;

const MyFavorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(
          `/api/mypage/${user.userSeq}/favorites?page=${page}&limit=${ITEMS_PER_PAGE}`
        );

        const data = res.data;
        if (data && Array.isArray(data.favorite)) {
          setFavorites(data.favorite);
          setTotalPages(Math.ceil(data.totalCount / ITEMS_PER_PAGE));
        } else {
          throw new Error("즐겨찾기 데이터가 없습니다.");
        }
      } catch (err) {
        console.error(err);
        setError("즐겨찾기 목록을 불러오는 중 오류가 발생했습니다.");
        setFavorites([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, page]);

  const handleClickFavorite = (post) => navigate(`/posts/${post.postSeq}`);
  const goToPrevPage = () => page > 1 && setPage(page - 1);
  const goToNextPage = () => page < totalPages && setPage(page + 1);

  if (!user) return <div className="mypage-more-container">로그인이 필요합니다.</div>;
  if (loading) return <div className="mypage-more-container">로딩 중...</div>;
  if (error) return <div className="mypage-more-container">{error}</div>;

  return (
    <div className="mypage-more-container">
      <h2>즐겨찾기한 글</h2>

      {favorites.length === 0 ? (
        <p className="mypage-more-empty">즐겨찾기한 글이 없습니다.</p>
      ) : (
        <>
          <ul className="mypage-more-list">
            {favorites.map((post) => (
              <li
                key={post.postSeq}
                className="mypage-more-item clickable"
                onClick={() => handleClickFavorite(post)}
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

export default MyFavorites;
