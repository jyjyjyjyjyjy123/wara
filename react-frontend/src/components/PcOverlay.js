import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // AuthContext 가져오기
import "../styles/PcOverlay.css";
import { ReactComponent as SearchIcon } from "../assets/images/icon/search.svg";

const PcOverlay = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // 로그인 정보
  const [searchText, setSearchText] = useState("");

  const popularKeywords = [
    "맛집", "카페", "서울", "부산", "바다",
    "후기", "친구", "데이트", "혼자", "여행"
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/board?query=${encodeURIComponent(searchText)}`);
      setSearchText("");
    }
  };

  const handleKeywordClick = (keyword) => {
    navigate(`/board?query=${encodeURIComponent(keyword)}`);
  };

  // 로그인 체크 후 이동
  const handleMyPageClick = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="pc-overlay">
      <img
        src={`${process.env.PUBLIC_URL}/logo2.png`}
        alt="Mapple 로고"
        className="pc-logo"
      />

      <form className="pc-search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button type="submit" className="pc-search-btn">
          <SearchIcon />
        </button>
      </form>

      <div className="pc-popular-keywords">
        <h3>인기 검색어</h3>
        <div className="pc-keywords-list">
          {popularKeywords.map((keyword) => (
            <button
              key={keyword}
              className="pc-keyword-btn"
              onClick={() => handleKeywordClick(keyword)}
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>

      <div className="pc-mypage-keywords">
        <h3>마이페이지 메뉴</h3>
        <div className="pc-cards">
          <div className="pc-card" onClick={() => handleMyPageClick("/mypage/myposts")}>
            게시글
          </div>
          <div className="pc-card" onClick={() => handleMyPageClick("/mypage/mycomments")}>
            댓글
          </div>
          <div className="pc-card" onClick={() => handleMyPageClick("/mypage/myfavorites")}>
            즐겨찾기
          </div>
          <div className="pc-card" onClick={() => handleMyPageClick("/mypage/mylikes")}>
            좋아요
          </div>
        </div>
      </div>
    </div>
  );
};

export default PcOverlay;
