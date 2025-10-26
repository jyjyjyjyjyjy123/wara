import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { usePost } from "../context/PostDetailContext";
import LocationMap from "../components/LocationMap";
import "../styles/PostDetail.css";

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL /*|| "http://localhost:8050"*/;

function PostDetail() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [commentInput, setCommentInput] = useState("");

  const { post, loading, error, toggleLike, toggleFavorite, addComment, deleteComment } = usePost();

  // 날짜 포맷팅 (24시:분)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const handleCommentSubmit = async () => {
    if (!user) return navigate("/login");
    if (!commentInput.trim()) return;

    await addComment(commentInput);
    setCommentInput("");
  };

  const handleEdit = () => {
    if (!user) return navigate("/login");
    if (user.userId !== post.user.userId) {
      alert("작성자만 수정할 수 있습니다.");
      return;
    }
    navigate(`/posts/${post.postSeq}/edit`);
  };

  const handleDelete = async () => {
    if (!user) return navigate("/login");
    if (user.userId !== post.user.userId) {
      alert("작성자만 삭제할 수 있습니다.");
      return;
    }
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await api.delete(`/api/posts/${post.postSeq}`);
        navigate("/board");
      } catch {
        alert("삭제에 실패했습니다.");
      }
    }
  };

  const handleDeleteComment = async (commentSeq, commentUserId) => {
    if (!user) return navigate("/login");
    if (user.userId !== commentUserId) {
      alert("작성자만 삭제할 수 있습니다.");
      return;
    }
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      try {
        await deleteComment(commentSeq);
      } catch {
        alert("댓글 삭제에 실패했습니다.");
      }
    }
  };

  if (loading) return <div className="post-loading">로딩중...</div>;
  if (error) return <div className="post-error">{error}</div>;
  if (!post) return <div className="post-error">게시글이 없습니다.</div>;

  return (
    <div className="post-detail-container">
      <div className="post-detail-card">
        <h2 className="post-title">{post.title}</h2>

        <div className="post-meta-top">
          <span className="post-author">작성자: {post.user.nickname}</span>
          <span className="post-views">조회수: {post.viewCount}</span>
        </div>

        <div className="post-meta-bottom">
          <span>작성일: {formatDate(post.createdAt)}</span>
          <span>수정일: {formatDate(post.updatedAt)}</span>
        </div>

        <div className="post-content">
          {post.contents.map((content) => (
            <div key={content.postContentSeq} className="post-content-item">
              {content.type === "TEXT" && <p>{content.content}</p>}
              {content.type === "IMAGE" && (
                <img
                  src={`${SERVER_BASE_URL}${content.content}`}
                  alt=""
                  className="post-image"
                />
              )}
              {content.type === "LOCATION" && (
                <LocationMap
                  latitude={content.latitude}
                  longitude={content.longitude}
                  content={content.content || "위치 정보"}
                />
              )}
            </div>
          ))}
        </div>

        <div className="post-actions-row">
          <div className="left-actions">
            <button
              onClick={toggleLike}
              className={`action-button ${post.liked ? "liked" : ""}`}
            >
              {post.liked ? "♥" : "♡"} 좋아요 ({post.likeCount})
            </button>
            <button
              onClick={toggleFavorite}
              className={`action-button ${post.favorited ? "favorited" : ""}`}
            >
              {post.favorited ? "★" : "☆"} 즐겨찾기 ({post.favoriteCount})
            </button>
          </div>

          {user && user.userId === post.user.userId && (
            <div className="right-actions">
              <button onClick={handleEdit} className="post-edit-btn">
                수정
              </button>
              <button onClick={handleDelete} className="post-delete-btn">
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="comments-section">
        <h3>댓글</h3>

        {post.comments.map((comment) => (
          <div key={comment.commentSeq} className="comment">
            <p>
              <strong>{comment.user.nickname}</strong>: {comment.content}
            </p>
            {user && user.userId === comment.user.userId && (
              <button
                onClick={() =>
                  handleDeleteComment(comment.commentSeq, comment.user.userId)
                }
                className="comment-delete-btn"
              >
                삭제
              </button>
            )}
          </div>
        ))}

        <div className="comment-input-area">
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="댓글을 입력하세요"
            rows={2}
          />
          <div className="comment-submit-wrapper">
            <button onClick={handleCommentSubmit}>댓글 등록</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
