import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

// 컨텍스트 생성
const PostContext = createContext();

// Provider 컴포넌트
export const PostDetailProvider = ({ children }) => {
  const { postSeq } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // 상태
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 게시글 상세정보 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/api/posts/${postSeq}`, {
          skipAuth: true,
          params: { userSeq: user?.userSeq },
        });
        setPost(res.data);
      } catch {
        setError("게시글을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSeq, user?.userSeq]);

  // 좋아요 토글
  const toggleLike = async () => {
    if (!user) return navigate("/login");

    await api.post(`/api/posts/${post.postSeq}/like`, null, {
      params: { userSeq: user.userSeq },
    });

    setPost((prev) => ({
      ...prev,
      liked: !prev.liked,
      likeCount: prev.likeCount + (prev.liked ? -1 : 1),
    }));
  };

  // 즐겨찾기 토글
  const toggleFavorite = async () => {
    if (!user) return navigate("/login");

    await api.post(`/api/posts/${post.postSeq}/favorite`, null, {
      params: { userSeq: user.userSeq },
    });

    setPost((prev) => ({
      ...prev,
      favorited: !prev.favorited,
      favoriteCount: prev.favoriteCount + (prev.favorited ? -1 : 1),
    }));
  };

  // 댓글 등록
  const addComment = async (content) => {
    if (!user) return navigate("/login");

    const res = await api.post(`/api/posts/${postSeq}/comment`, {
      userSeq: user.userSeq,
      postSeq: Number(postSeq),
      content,
    });

    setPost((prev) => ({
      ...prev,
      comments: [
        ...prev.comments,
        {
          ...res.data,
          user: { userId: user.userId, nickname: user.nickname },
        },
      ],
    }));
  };

  // 댓글 삭제
  const deleteComment = async (commentSeq) => {
    if (!user) return navigate("/login");

    await api.delete(`/api/posts/comments/${commentSeq}`);

    setPost((prev) => ({
      ...prev,
      comments: prev.comments.filter((c) => c.commentSeq !== commentSeq),
    }));
  };

  return (
    <PostContext.Provider
      value={{
        post,
        loading,
        error,
        toggleLike,
        toggleFavorite,
        addComment,
        deleteComment,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

// 커스텀 훅
export const usePost = () => useContext(PostContext);
