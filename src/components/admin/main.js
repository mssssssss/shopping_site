// 后台管理的主页面
import { Layout, theme } from "antd";
import React, { useState } from "react";
import "../../assets/css/main.css";
import ContentMain from "./contentMain";
import Aside from "./aside";
import MyHeader from "./header";
import ErrorBoundary from "../../utils/errorBoundary";
const { Content, Footer } = Layout;

export default function Main() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  function handleClick(data) {
    console.log("0---" + data);
    // console.log("Parent received value from child: " + data);
    // 修改aside侧边栏中collapsed的值
    setCollapsed(!data);
  }

  return (
    <Layout>
      {/* 根据用户角色显示不同的侧边栏 */}
      <Aside col={collapsed}></Aside>
      <Layout className="site-layout">
        <MyHeader onClick1={handleClick}></MyHeader>
        {/* 这里可能出错，在这里设置错误边界 */}
        <ErrorBoundary>
          <Content
            style={{
              margin: "16px 16px",
              padding: 24,
              minHeight: 476,
              background: colorBgContainer,
            }}
          >
            {/* 在这里设置路由出口 */}
            <ContentMain></ContentMain>
          </Content>
        </ErrorBoundary>
        <Footer
          style={{
            textAlign: "center",
            color: "#000",
            backgroundColor: "#fff",
            padding: "12px",
          }}
        >
          <div>
            Copyright©1999-2023, ctrip.com. All rights reserved. |
            ICP证：沪B2-20050130 | 沪ICP备08023580号-3
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
}
