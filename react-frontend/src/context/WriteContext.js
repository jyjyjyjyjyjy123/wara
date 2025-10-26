import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const WriteContext = createContext();

export const WriteProvider = ({ children, editMode, postSeq }) => {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState([]);

  useEffect(() => {
    if (!editMode || !postSeq) return;

    const fetchPost = async () => {
      try {
        const res = await api.get(`/api/posts/${postSeq}`);
        const post = res.data;
        setTitle(post.title);
        setContents(
          post.contents.map((c) => ({
            id: Date.now() + Math.random(),
            type: c.type.toLowerCase(),
            data: c.content,
            latitude: c.latitude,
            longitude: c.longitude,
          }))
        );
      } catch (err) {
        alert("게시글 정보를 불러오는 데 실패했습니다.");
      }
    };

    fetchPost();
  }, [editMode, postSeq]);

  const addContentBlock = (type) => {
    setContents((prev) => [...prev, { id: Date.now(), type, data: "" }]);
  };

  const updateContentData = (id, newData) => {
    setContents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, data: newData } : c))
    );
  };

  const removeContentBlock = (id) => {
    setContents((prev) => prev.filter((c) => c.id !== id));
  };

  const moveContent = (id, direction) => {
    setContents((prev) => {
      const index = prev.findIndex((c) => c.id === id);
      if (
        (direction === "up" && index === 0) ||
        (direction === "down" && index === prev.length - 1)
      ) {
        return prev;
      }
      const newContents = [...prev];
      const swapWith = direction === "up" ? index - 1 : index + 1;
      [newContents[index], newContents[swapWith]] = [
        newContents[swapWith],
        newContents[index],
      ];
      return newContents;
    });
  };

  return (
    <WriteContext.Provider
      value={{
        title,
        setTitle,
        contents,
        setContents,
        addContentBlock,
        updateContentData,
        removeContentBlock,
        moveContent,
      }}
    >
      {children}
    </WriteContext.Provider>
  );
};
