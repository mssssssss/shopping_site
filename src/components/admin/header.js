// 后台管理主页面中的头部栏
import { Layout, Avatar, Dropdown, Space, theme } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import userPic from "../../assets/images/head.jpg";
import adminPic from "../../assets/images/bg.jpg";
const { Header } = Layout;

// 菜单设置
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

// 头像栏下拉菜单
const items = [getItem("个人信息", "/personInfo"), getItem("退出", "/exit")];
const role = JSON.stringify(reactLocalStorage.getObject("role"));
let flag = role === "0"; // 当前是否为普通用户
const username = reactLocalStorage.getObject("token");
export default function MyHeader({ onClick1 }) {
  // 控制菜单的折叠
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();
  // 点击下拉菜单的信息
  const onClick = ({ key }) => {
    // console.log(key);
    if (key === "/exit") {
      // 清空登录信息 并跳转到登录页面
      reactLocalStorage.clear();
      navigate("/login", { replace: true });
      return;
    }
    if (flag) {
      // 编程式跳转到某个路由
      navigate("/user" + key, { replace: true }); //跳转到对应路由
    } else {
      navigate("/admin" + key, { replace: true }); //跳转到对应路由
    }
  };

  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: "trigger",
        onClick: () => {
          setCollapsed(!collapsed);
          onClick1(collapsed); //将collapsed的值传递给onClick函数
        },
      })}

      <Dropdown menu={{ items, onClick }}>
        <a
          href="/"
          style={{ marginRight: 30 }}
          onClick={(e) => e.preventDefault()}
        >
          <Space>
            <Avatar
              src={<img src={flag ? userPic : adminPic} alt="avatar" />}
            />
            {username}
          </Space>
        </a>
      </Dropdown>
    </Header>
  );
}
