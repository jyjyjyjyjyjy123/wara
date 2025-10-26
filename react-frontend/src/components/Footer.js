import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Footer.css";

import { ReactComponent as HomeIcon } from "../assets/images/icon/home.svg";
import { ReactComponent as BoardIcon } from "../assets/images/icon/board.svg";
import { ReactComponent as DateMapIcon } from "../assets/images/icon/location.svg";
import { ReactComponent as UnKnownIcon } from "../assets/images/icon/unknown.svg";
import { ReactComponent as MyPageIcon } from "../assets/images/icon/mypage.svg";

const Footer = () => {
  const navItems = [
    { to: "/", icon: <HomeIcon />, label: "홈" },
    { to: "/board", icon: <BoardIcon />, label: "게시판" },
    { to: "/datemap", icon: <DateMapIcon />, label: "포인트맵" },
    { to: "/unknown", icon: <UnKnownIcon />, label: "미정" },
    { to: "/mypage", icon: <MyPageIcon />, label: "마이페이지" },
  ];

  return (
    <nav className="footer-nav">
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `footer-item ${isActive ? "active" : ""}`
          }
        >
          <div className="footer-icon">{icon}</div>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Footer;
