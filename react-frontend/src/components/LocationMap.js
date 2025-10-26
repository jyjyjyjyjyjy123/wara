import React, { useEffect, useRef } from "react";
import useKakaoMapScript from "../hooks/useKakaoMapScript";

function LocationMap({ latitude, longitude, content }) {
  const mapRef = useRef(null);
  const kakaoLoaded = useKakaoMapScript();

  useEffect(() => {
    if (!kakaoLoaded || !latitude || !longitude) return;

    const container = mapRef.current;
    const options = {
      center: new window.kakao.maps.LatLng(latitude, longitude),
      level: 4,
    };

    const map = new window.kakao.maps.Map(container, options);
    map.setZoomable(false);

    // 줌 컨트롤 추가
    const zoomControl = new window.kakao.maps.ZoomControl();
    map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

    const position = new window.kakao.maps.LatLng(latitude, longitude);

    // 마커 추가
    const marker = new window.kakao.maps.Marker({ position, map });

    const ps = new window.kakao.maps.services.Places();

    if (content) {
      // 키워드 검색
      ps.keywordSearch(content, function (result, status) {
        if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
          const place = result[0];
          const kakaoMapUrl = `https://map.kakao.com/?itemId=${place.id}`;

          const overlayContent = `
            <div class="customoverlay">
              <div class="overlay-box">
                <a href="${kakaoMapUrl}" target="_blank" rel="noopener noreferrer" class="overlay-title-link" onclick="event.stopPropagation();">
                  ${place.place_name}
                </a>
                <div class="overlay-arrow"></div>
              </div>
            </div>
          `;

          const customOverlay = new window.kakao.maps.CustomOverlay({
            content: overlayContent,
            position,
            yAnchor: 2.3,
            clickable: true,
          });

          customOverlay.setMap(map);
        } else {
          showFallbackOverlay();
        }
      });
    } else {
      showFallbackOverlay();
    }

    // 🔙 fallback: content 없거나 검색 실패 시
    function showFallbackOverlay() {
      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.coord2Address(longitude, latitude, (result, status) => {
        let placeName = "위치 정보";

        if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
          const info = result[0];
          placeName =
            info.buildingName && info.buildingName.trim() !== ""
              ? info.buildingName
              : info.roadAddress?.addressName || info.address?.addressName || placeName;
        } else if (content) {
          placeName = content;
        }

        const overlayContent = `
          <div class="customoverlay">
            <div class="overlay-box">
              <span class="overlay-title-link">${placeName}</span>
              <div class="overlay-arrow"></div>
            </div>
          </div>
        `;

        const fallbackOverlay = new window.kakao.maps.CustomOverlay({
          content: overlayContent,
          position,
          yAnchor: 2.3,
          clickable: true,
        });

        fallbackOverlay.setMap(map);
      });
    }
  }, [kakaoLoaded, latitude, longitude, content]);

  return (
    <div>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "300px", marginTop: "10px" }}
      />
    </div>
  );
}

export default LocationMap;
