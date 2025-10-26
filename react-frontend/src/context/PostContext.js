import React, { createContext, useContext, useState } from "react";
import api from "../api/axios";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: 10,
    totalPages: 1,
    totalElements: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ 게시글 가져오기 (정렬 + 페이징)
  const fetchPosts = async (page = 0, size = 10, sort = "latest") => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/posts", {
        params: { page, size, sort },
      });

      // 백엔드에서 PostPageResponse 구조로 받음
      setPosts(res.data.content);
      setPageInfo({
        page: res.data.page,
        size: res.data.size,
        totalPages: res.data.totalPages,
        totalElements: res.data.totalElements,
      });
    } catch (err) {
      console.error("게시글 불러오기 실패:", err);
      setError("게시글을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData) => {
    try {
      const res = await api.post("/api/posts", postData);
      await fetchPosts();
      return res.data;
    } catch (err) {
      console.error("게시글 작성 실패:", err);
      throw err;
    }
  };

  const fetchPostDetail = async (postSeq) => {
    try {
      const res = await api.get(`/api/posts/${postSeq}`);
      return res.data;
    } catch (err) {
      console.error("게시글 상세보기 실패:", err);
      throw err;
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        pageInfo,
        loading,
        error,
        fetchPosts,
        createPost,
        fetchPostDetail,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => useContext(PostContext);
