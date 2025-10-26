import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePost } from "../context/PostContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Board.css";
import BoardPostItem from "../components/BoardPostItem";

console.log("🌏 환경변수 확인:");
console.log("API:", process.env.REACT_APP_API_URL);
console.log("KAKAO:", process.env.REACT_APP_KAKAO_KEY);
console.log("SERVER:", process.env.REACT_APP_SERVER_URL);

function Board() {
  const { posts, fetchPosts, loading, error } = usePost();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(query);
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(0);
  const size = 10; // 한 페이지에 보여줄 글 수

  useEffect(() => {
    fetchPosts(0, 1000, sort); // 전체 게시글을 가져온 뒤 프론트에서 페이징 처리
  }, [sort]);

  useEffect(() => setSearchTerm(query), [query]);

  const handleWriteClick = () => {
    if (user) navigate("/posts/write");
    else navigate("/login");
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  // 검색 필터
  const filteredPosts = posts.filter((post) => {
    if (!post) return false; // null 방어
    const titleMatch = post.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const nicknameMatch = post.user?.nickname?.toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || nicknameMatch;
  });

  // 페이지네이션 적용
  const totalPages = Math.ceil(filteredPosts.length / size);
  const paginatedPosts = filteredPosts.slice(page * size, page * size + size);

  return (
    <div className="board-container" style={{ position: "relative" }}>
      <h2 className="board-title">게시판</h2>

      {/* 검색 + 글쓰기 */}
      <div className="board-top-controls" style={{ display: "flex", gap: "8px" }}>
        <div className="board-search-wrapper">
          <input
            type="text"
            placeholder="제목 또는 작성자 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="board-search-input"
          />
          {searchTerm && (
            <button
              className="board-search-clear"
              onClick={() => setSearchTerm("")}
              type="button"
            >
              ×
            </button>
          )}
        </div>

        <button className="board-write-button" onClick={handleWriteClick}>
          글쓰기
        </button>
      </div>

      {/* 정렬 버튼 */}
      <div className="board-sort-select">
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(0);
          }}
          className="sort-dropdown"
        >
          <option value="latest">최신순</option>
          <option value="view">조회순</option>
          <option value="like">좋아요순</option>
          <option value="favorite">즐겨찾기순</option>
        </select>
      </div>

      {/* 게시글 리스트 */}
      <ul className="board-post-list">
        {paginatedPosts.length === 0 ? (
          <li className="board-no-results">검색 결과가 없습니다.</li>
        ) : (
          paginatedPosts.map((post) => (
            <BoardPostItem
              key={post.postSeq}
              post={post}
              navigate={navigate}
              formatDate={formatDate}
            />
          ))
        )}
      </ul>

      {/* 로딩 오버레이 */}
      {loading && <div className="board-loading-overlay">로딩중...</div>}

      {/* 페이지네이션 */}
      <div className="board-pagination">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="page-btn"
        >
          이전
        </button>
        <span>
          {page + 1} / {totalPages || 1}
        </span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
          className="page-btn"
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default Board;
