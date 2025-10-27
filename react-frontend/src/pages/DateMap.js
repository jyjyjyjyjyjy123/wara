import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../api/axios";
import useKakaoMapScript from "../hooks/useKakaoMapScript";
import "../styles/DateMap.css";

function DateMap() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const targetPlace = params.get("place");

  const [map, setMap] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const kakaoLoaded = useKakaoMapScript();

  // 지도 초기화
  useEffect(() => {
    if (!kakaoLoaded || !window.kakao) return;

    const container = document.getElementById("map");

    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780),
      level: 7,
    };
    const kakaoMap = new window.kakao.maps.Map(container, options);
    setMap(kakaoMap);
  }, [kakaoLoaded]);

  // 마커 생성 + 커스텀 오버레이 + 자동 클릭
  useEffect(() => {
    if (!map || !window.kakao) return;

    axios.get("/api/posts/map/locations").then((res) => {
      const locations = res.data;
      const markers = [];

      locations.forEach((loc) => {
        if (!loc.latitude || !loc.longitude) return;

        const position = new window.kakao.maps.LatLng(loc.latitude, loc.longitude);
        const marker = new window.kakao.maps.Marker({ position });
        marker.setMap(map);
        markers.push({ marker, loc });

        const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(loc.content || "", (result, status) => {
          let kakaoMapUrl = "#";
          if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
            kakaoMapUrl = `https://map.kakao.com/?itemId=${result[0].id}`;
          }

          const overlayContent = `
            <div class="customoverlay">
              <div class="overlay-box">
                <a href="${kakaoMapUrl}" target="_blank" rel="noopener noreferrer" class="overlay-title-link">
                  ${loc.content}
                </a>
                <div class="overlay-arrow"></div>
              </div>
            </div>
          `;

          const overlay = new window.kakao.maps.CustomOverlay({
            position,
            content: overlayContent,
            yAnchor: 2.3,
            clickable: true,
          });
          overlay.setMap(map);
        });

        window.kakao.maps.event.addListener(marker, "click", () => {
          axios
            .get("/api/posts/map/posts", {
              params: { latitude: loc.latitude, longitude: loc.longitude },
            })
            .then((res) => setRelatedPosts(res.data));
        });
      });

      if (targetPlace) {
        const target = markers.find((m) => m.loc.content === targetPlace);
        if (target) {
          window.kakao.maps.event.trigger(target.marker, "click");
          map.setCenter(
            new window.kakao.maps.LatLng(target.loc.latitude, target.loc.longitude)
          );
        }
      }
    });
  }, [map, targetPlace]);

  return (
    <div className="date-map-container">
      <div id="map" style={{ width: "100%", height: "500px" }}></div>

      <div className="related-posts">
        <h3>해당 지역 게시글</h3>
        {relatedPosts.length === 0 ? (
          <p className="empty">이 지역에 등록된 게시글이 없습니다.</p>
        ) : (
          <ul>
            {relatedPosts.map((post) => (
              <li key={post.postSeq}>
                <a href={`/posts/${post.postSeq}`}>{post.title}</a>
                <span>{formatDate(post.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const formatDate = (timestamp) => new Date(timestamp).toISOString().split("T")[0];

export default DateMap;
