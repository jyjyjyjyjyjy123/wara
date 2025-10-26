import React from "react";
import defaultThumbnail from "../assets/images/default_thumbnail.png";

const BoardPostItem = React.memo(({ post, navigate, formatDate }) => {
  const thumbnail =
    post.thumbnail ||
    (post.images && post.images.length > 0 ? post.images[0].url : defaultThumbnail);

  return (
    <li
      onClick={() => navigate(`/posts/${post.postSeq}`)}
      className="board-post-item"
    >
      <div className="board-post-thumbnail">
        <img src={thumbnail} alt="썸네일" />
      </div>
      <div className="board-post-content">
        <div className="board-post-title">{post.title}</div>
        <div className="board-post-author">작성자: {post.user.nickname}</div>
        <div className="board-post-date">수정일: {formatDate(post.updatedAt)}</div>
        <div className="board-post-stats">
          조회수: {post.viewCount} | 좋아요: {post.likeCount} | 즐겨찾기: {post.favoriteCount}
        </div>
      </div>
    </li>
  );
});

export default BoardPostItem;
