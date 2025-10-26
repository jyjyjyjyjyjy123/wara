import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Write.css";

const { kakao } = window;

const Write = ({ editMode }) => {
  const { user } = useAuth();
  const { postSeq } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [contents, setContents] = useState([]);
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState(null);

  const searchTimeoutRef = useRef(null);

  // 수정 모드 시 기존 글 불러오기
  useEffect(() => {
    if (!editMode || !postSeq) return;

    const fetchPost = async () => {
      try {
        const res = await api.get(`/api/posts/${postSeq}`);
        const post = res.data;

        // 작성자 체크
        if (user.userSeq !== post.user.userSeq) {
          alert("게시글 작성자만 수정할 수 있습니다.");
          navigate(-1);
          return;
        }

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
      } catch {
        alert("게시글 정보를 불러오는 데 실패했습니다.");
        navigate(-1);
      }
    };

    fetchPost();
  }, [editMode, postSeq, user, navigate]);


  // 콘텐츠 관리
  const addContentBlock = (type) => {
    setContents((prev) => [...prev, { id: Date.now(), type, data: "" }]);
    setShowTypeSelector(false);
  };
  const updateContentData = (id, newData) =>
    setContents((prev) => prev.map((c) => (c.id === id ? { ...c, data: newData } : c)));
  const removeContentBlock = (id) =>
    setContents((prev) => prev.filter((c) => c.id !== id));
  const moveContent = (id, direction) => {
    setContents((prev) => {
      const index = prev.findIndex((c) => c.id === id);
      if ((direction === "up" && index === 0) || (direction === "down" && index === prev.length - 1)) return prev;
      const newContents = [...prev];
      const swapWith = direction === "up" ? index - 1 : index + 1;
      [newContents[index], newContents[swapWith]] = [newContents[swapWith], newContents[index]];
      return newContents;
    });
  };

  // 위치 검색
  const searchLocations = (keyword, callback) => {
    if (!kakao || !kakao.maps.services) return;
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, callback, { size: 8 });
  };

  const onLocationInputChange = (id, value) => {
    updateContentData(id, value);
    setSearchKeyword(value);
    setSelectedLocationId(null);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!value.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(value, (data, status) => {
        if (status === kakao.maps.services.Status.OK) setSearchResults(data.slice(0, 8));
        else setSearchResults([]);
        setIsSearching(false);
      });
    }, 400);
  };

  const onSelectLocation = (contentId, place) => {
    updateContentData(contentId, place.place_name);
    setContents((prev) =>
      prev.map((c) =>
        c.id === contentId ? { ...c, latitude: place.y, longitude: place.x, data: place.place_name } : c
      )
    );
    setSearchResults([]);
    setSearchKeyword("");
    setSelectedLocationId(contentId);
  };

  // 이미지 업로드
  const uploadImage = async (file, onChange) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/api/posts/upload", formData, { withCredentials: true });
      onChange(res.data.imageUrl);
    } catch {
      alert("이미지 업로드 실패");
    }
  };

  const handleImageChange = (e, onChange) => {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) return alert("이미지 용량이 10MB를 초과했습니다.");

    uploadImage(file, onChange);
  };

  // 게시글 등록/수정
  const handleSubmit = async () => {
    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (contents.length === 0) return alert("최소 하나의 콘텐츠를 추가해주세요.");
    if (!user?.userSeq) return alert("로그인이 필요합니다.");
  // 각 콘텐츠 블록이 비어있는지 체크
    for (let c of contents) {
      if (!c.data || !c.data.toString().trim()) {
        return alert("모든 콘텐츠는 내용을 입력해야 합니다.");
      }
    }

    const formattedContents = contents.map((c, index) => {
      const base = { type: c.type.toUpperCase(), content: c.data || "", orderNum: index + 1 };
      if (c.type === "location") return { ...base, latitude: c.latitude || 37.123, longitude: c.longitude || 127.123 };
      return base;
    });

    try {
      if (editMode) {
        await api.put(`/api/posts/${postSeq}`, { title, contents: formattedContents });
        alert("게시글이 수정되었습니다.");
        navigate(`/posts/${postSeq}`);
      } else {
        await api.post("/api/posts", { title, userSeq: user.userSeq, contents: formattedContents });
        alert("게시글이 등록되었습니다.");
        navigate("/board");
      }
    } catch {
      alert(editMode ? "수정에 실패했습니다." : "등록에 실패했습니다.");
    }
  };

  return (
    <div className="write-container">
      <input
        className="write-title-input"
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        maxLength={50}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="write-content-list">
        {contents.map(({ id, type, data, latitude, longitude }, index) => (
          <ContentBlock
            key={id}
            type={type}
            data={data}
            latitude={latitude}
            longitude={longitude}
            onChange={(newData) => (type === "location" ? onLocationInputChange(id, newData) : updateContentData(id, newData))}
            onRemove={() => removeContentBlock(id)}
            onMoveUp={() => moveContent(id, "up")}
            onMoveDown={() => moveContent(id, "down")}
            isFirst={index === 0}
            isLast={index === contents.length - 1}
            searchResults={type === "location" ? searchResults : []}
            onSelectLocation={(place) => onSelectLocation(id, place)}
            isSearching={type === "location" ? isSearching : false}
            selectedLocationId={selectedLocationId}
            blockId={id}
            handleImageChange={handleImageChange}
          />
        ))}
      </div>

      <div className="write-add-content-section">
        <button className="write-add-content-button" onClick={() => setShowTypeSelector((prev) => !prev)}>
          콘텐츠 추가하기
        </button>
        {showTypeSelector && (
          <div className="write-type-selector">
            <button onClick={() => addContentBlock("text")}>글</button>
            <button onClick={() => addContentBlock("image")}>이미지</button>
            <button onClick={() => addContentBlock("location")}>위치</button>
            <button onClick={() => setShowTypeSelector(false)}>취소</button>
          </div>
        )}
      </div>

      <button onClick={handleSubmit} className="write-submit-button">
        {editMode ? "수정하기" : "게시글 등록"}
      </button>
    </div>
  );
};

// 콘텐츠 블록 컴포넌트
const ContentBlock = ({
  type,
  data,
  latitude,
  longitude,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  searchResults,
  onSelectLocation,
  isSearching,
  selectedLocationId,
  blockId,
  handleImageChange,
}) => (
  <div className="content-block">
    <div className="content-block-toolbar">
      <button onClick={onMoveUp} disabled={isFirst} title="위로 이동">▲</button>
      <button onClick={onMoveDown} disabled={isLast} title="아래로 이동">▼</button>
      <button onClick={onRemove} title="삭제">✕</button>
    </div>

    {type === "text" && (
      <textarea className="content-textarea" value={data} placeholder="글 내용을 입력하세요" onChange={(e) => onChange(e.target.value)} />
    )}

    {type === "image" && (
      <div>
        <input type="file" accept="image/*" className="content-image-input" onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;
          const previewUrl = URL.createObjectURL(file);
          onChange(previewUrl);
          handleImageChange(e, onChange);
        }} />
        {data && <img src={data} alt="미리보기" className="content-image-preview" />}
      </div>
    )}

    {type === "location" && (
      <div className="content-location-wrapper">
        <input
          type="text"
          className="content-location-input"
          value={data}
          placeholder="위치를 검색하세요"
          onChange={(e) => onChange(e.target.value)}
        />
        {isSearching && <div className="location-loading">검색 중...</div>}
        {searchResults.length > 0 && selectedLocationId !== blockId && (
          <ul className="location-search-results">
            {searchResults.map((place) => (
              <li key={place.id} className="location-search-item" onClick={() => onSelectLocation(place)}>
                {place.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    )}
  </div>
);

export default Write;
