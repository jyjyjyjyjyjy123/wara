import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

// 배너 이미지
import banner1 from "../assets/images/banner1.png";
import banner2 from "../assets/images/banner2.png";
import banner3 from "../assets/images/banner3.png";

// 기본 썸네일
import defaultThumbnail from "../assets/images/default_thumbnail.png";

import "../styles/main.css";

function Main() {
  const navigate = useNavigate();
  const [popularPosts, setPopularPosts] = useState([]);
  const [popularPlaces, setPopularPlaces] = useState([]);

  const carouselImages = [banner1, banner2, banner3];
  const [currentSlide, setCurrentSlide] = useState(0);

  // 슬라이드 상태
  const popularRef = useRef(null);
  const popularPlacesRef = useRef(null);

  const [indices, setIndices] = useState({
    popular: 0,
    popularPlaces: 0,
  });

  // 배너 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [popularRes, placesRes] = await Promise.all([
          api.get("/api/posts/popular"),
          api.get("/api/posts/popular/locations"),
        ]);
        setPopularPosts(popularRes.data);
        setPopularPlaces(placesRes.data);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      }
    };
    fetchData();
  }, []);

  // 슬라이드 이동
  const handlePrev = (section) => {
    setIndices((prev) => ({ ...prev, [section]: Math.max(prev[section] - 1, 0) }));
  };

  const handleNext = (section, posts, ref) => {
    if (!ref.current) return;
    const visibleCount = Math.floor(ref.current.offsetWidth / 468);
    const maxIndex = Math.max(posts.length - visibleCount, 0);
    setIndices((prev) => ({ ...prev, [section]: Math.min(prev[section] + 1, maxIndex) }));
  };

  // transform 적용
  useEffect(() => {
    if (popularRef.current)
      popularRef.current.style.transform = `translateX(-${indices.popular * 468}px)`;
    if (popularPlacesRef.current)
      popularPlacesRef.current.style.transform = `translateX(-${indices.popularPlaces * 468}px)`;
  }, [indices]);

  const startXRef = useRef({ popular: 0, popularPlaces: 0 });

  const handleTouchStart = (section) => (e) => {
    startXRef.current[section] = e.touches[0].clientX;
  };

  const handleTouchEnd = (section, posts, ref) => (e) => {
    const diff = startXRef.current[section] - e.changedTouches[0].clientX;
    if (diff > 30) handleNext(section, posts, ref);
    else if (diff < -30) handlePrev(section);
  };

  const handlePostClick = (postSeq) => navigate(`/posts/${postSeq}`);
  const handlePlaceClick = (placeName) =>
    navigate(`/datemap?place=${encodeURIComponent(placeName)}`);

  // 인기글 카드
  const renderPopularPosts = (posts) =>
    posts.map((post) => {
      const thumbnail = post.thumbnail ? decodeURIComponent(post.thumbnail) : defaultThumbnail;
      return (
        <div
          key={post.postSeq}
          className="post-card"
          onClick={() => handlePostClick(post.postSeq)}
        >
          <div className="thumbnail">
            <img src={thumbnail} alt={post.title} />
          </div>
          <div className="post-info">
            <h3>{post.title}</h3>
            <p className="nickname">{post.user?.nickname}</p>
            <p className="counts">
              ❤ {post.likeCount} · ⭐ {post.favoriteCount} · 👁 {post.viewCount}
            </p>
          </div>
        </div>
      );
    });

  // 인기 장소 카드 (닉네임, 좋아요 등 제거)
  const renderPopularPlaces = (places) =>
    places.map((place, idx) => (
      <div
        key={idx}
        className="post-card"
        onClick={() => handlePlaceClick(place.content)}
      >
        <div className="thumbnail">
          <img src={defaultThumbnail} alt={place.content} />
        </div>
        <div className="post-info">
          <h3>{place.content}</h3>
        </div>
      </div>
    ));

  const sections = [
    { title: "인기 글", posts: popularPosts, ref: popularRef, key: "popular", renderer: renderPopularPosts },
    { title: "인기 많은 장소", posts: popularPlaces, ref: popularPlacesRef, key: "popularPlaces", renderer: renderPopularPlaces },
  ];

  return (
    <div className="main-container">
      {/* 배너 */}
      <section className="carousel-section">
        <div className="carousel">
          {carouselImages.map((img, idx) => (
            <div key={idx} className={`slide ${idx === currentSlide ? "active" : ""}`}>
              <img src={img} alt={`배너${idx + 1}`} />
            </div>
          ))}

          {/* 진행바 (dot 대체) */}
          <div className="dots">
            <div
              className="dot-bar"
              style={{
                transform: `translateX(${currentSlide * 100}%)`
              }}
            />
          </div>

          <button
            className="prev"
            onClick={() =>
              setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
            }
          >
            ‹
          </button>
          <button
            className="next"
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
            }
          >
            ›
          </button>
        </div>
      </section>

      {/* 🔥 인기 글 / 📍 인기 장소 */}
      {sections.map(({ title, posts, ref, key, renderer }) => (
        <section className="popular-section" key={key}>
          <h2>{title}</h2>
          <div
            className="post-carousel hover-show-buttons"
            onTouchStart={handleTouchStart(key)}
            onTouchEnd={handleTouchEnd(key, posts, ref)}
          >
            <button className="prev" onClick={() => handlePrev(key)} disabled={indices[key] === 0}>
              ‹
            </button>
            <div className="post-track-wrapper">
              <div className="post-track" ref={ref}>
                {renderer(posts)}
              </div>
            </div>
            <button
              className="next"
              onClick={() => handleNext(key, posts, ref)}
              disabled={
                ref.current &&
                indices[key] >= posts.length - Math.floor(ref.current.offsetWidth / 190)
              }
            >
              ›
            </button>
          </div>
        </section>
      ))}
    </div>
  );
}

export default Main;
