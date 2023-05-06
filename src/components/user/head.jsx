import React from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Space } from "antd";
import "../../assets/css/header.css";
import userPic from "../../assets/images/head.jpg";
import logo from "../../assets/images/logo.jpg";
import { getItem } from "../../utils/formLayout";

export default function Head() {
  const token = JSON.stringify(reactLocalStorage.getObject("token")) !== "{}";
  const username = reactLocalStorage.getObject("token"); //当前用户名
  const role = reactLocalStorage.getObject("role"); //当前角色
  const items = [getItem("个人中心", "/user"), getItem("退出登录", "/exit")];
  const navigate = useNavigate();
  // 点击下拉菜单的信息
  const onClick = ({ key }) => {
    if (key === "/exit") {
      // 清空登录信息 并跳转到登录页面
      reactLocalStorage.clear();
      navigate("/index", { replace: true });
      return;
    } else {
      // 编程式跳转到某个路由
      // navigate("/user"); //跳转到对应路由
      window.location.href = "/user";
    }
  };
  return (
    <div className="top-content">
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <div className="top-logo" style={{ marginLeft: 60 }}>
        <NavLink to="/">
          <img src={logo} alt="website's logo" />
        </NavLink>
      </div>
      <div className="top-href" style={{ marginRight: 80 }}>
        {token && role === 0 ? (
          <div>
            <Dropdown menu={{ items, onClick }}>
              <a href="/" onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar src={<img src={userPic} alt="avatar" />} />
                  {username}
                </Space>
              </a>
            </Dropdown>
          </div>
        ) : (
          // <NavLink to="/user">个人中心</NavLink>
          <div style={{ position: "relative", fontSize: 15 }}>
            <NavLink
              to="/login"
              style={{
                backgroundColor: "rgba(202, 228, 255, 0.5)",
                borderRadius: 16,
                padding: "5px 3px",
                marginRight: 15,
              }}
            >
              <UserOutlined
                style={{
                  position: "absolute",
                  left: "11px",
                  top: "3px",
                  fontSize: 18,
                }}
              />
              <span style={{ marginLeft: "32px", paddingRight: "8px" }}>
                请登录
              </span>
            </NavLink>
            <NavLink to="/register">去注册</NavLink>
          </div>
        )}
      </div>
    </div>
  );
}
