import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { ReactComponent as SearchIcon } from "../assets/images/icon/search.svg";

const Header = () => {
  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/board?query=${encodeURIComponent(searchText)}`);
      setSearchText("");
      setShowSearch(false); // 검색 후 검색창 닫기
    }
  };

  const toggleSearch = () => {
    setShowSearch((prev) => !prev); // 클릭할 때마다 토글
  };

  return (
    <header className="header">
      <div className="header-inner">
        <h1 className="logo" onClick={() => navigate("/")}>
          <img
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="Mapple 로고"
            className="header-logo"
          />
        </h1>

        {/* 검색창 */}
        <form
          className={`search-form ${showSearch ? "active" : ""}`}
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            autoFocus={showSearch}
          />
        </form>

        {/* 토글 버튼 */}
        <button
          className="search-toggle-btn"
          onClick={toggleSearch}
          aria-label="검색창 토글"
        >
          <SearchIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;
