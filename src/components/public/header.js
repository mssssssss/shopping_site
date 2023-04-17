// 前台页面的头部栏
import logo from "../../assets/images/logo.jpg";
import { NavLink } from "react-router-dom";
import { HomeFilled } from "@ant-design/icons";
import "../../assets/css/header.css";

export default function Header() {
  return (
    <div className="top-content">
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <div className="top-logo">
        <NavLink to="/">
          <img src={logo} alt="website's logo" />
        </NavLink>
      </div>
      <div className="top-href">
        <NavLink to="/">
          <HomeFilled style={{ color: "#5678a8", marginRight: 6 }} />
          首页
        </NavLink>
      </div>
    </div>
  );
}
