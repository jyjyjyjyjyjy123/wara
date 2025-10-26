import { useState, useEffect } from "react";

function useKakaoMapScript() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    console.log("카카오 키:", process.env.REACT_APP_KAKAO_KEY);
    // 이미 kakao가 로드된 경우
    if (window.kakao && window.kakao.maps) {
      if (window.kakao.maps.LatLng) {
        setLoaded(true);
      } else {
        // maps.load()가 아직 안 된 상태라면 로드 후 true로
        window.kakao.maps.load(() => setLoaded(true));
      }
      return;
    }

    // 새로 스크립트 로드
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      // maps 객체 로드 후 setLoaded
      window.kakao.maps.load(() => setLoaded(true));
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return loaded;
}

export default useKakaoMapScript;
