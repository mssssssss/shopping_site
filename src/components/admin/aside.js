// 后台管理主页面的侧边栏
import { Layout, Menu } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import { getItem } from "../../utils/formLayout";
const { Sider } = Layout;

let flag = reactLocalStorage.getObject("role") === 0; // 当前是否为普通用户
// 给不同用户传递不同的菜单信息
let item = [];
if (flag) {
  item = [
    getItem("我的", "/user", <SettingOutlined />, [
      getItem("订单信息", "/user/orderInfo"),
    ]),
  ];
} else {
  item = [
    getItem("后台管理", "/admin", <SettingOutlined />, [
      getItem("用户管理", "/admin/userManage"),
      getItem("订单管理", "/admin/orderManage"),
    ]),
  ];
}

export default function Aside({ col }) {
  console.log("col" + col);
  const navigate = useNavigate();
  let { pathname } = useLocation();
  // 点击菜单项
  function selectItem(e) {
    console.log(e);
    navigate(e.key, { replace: true }); //跳转到对应路由
  }

  let [openKey, setOpenKey] = useState(flag ? ["/user"] : ["/admin"]); // 设置默认展开的子菜单
  // 点击子菜单展开
  function openChange() {
    setOpenKey(); // 置空展开信息
  }

  return (
    <Sider trigger={null} collapsible collapsed={col}>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="inline"
        // 当前展开的子菜单
        openKeys={openKey}
        // 初始化选择的菜单项key // 根据路由信息来高亮菜单
        // 如果是/admin刚进来页面 也要高亮“用户管理”
        defaultSelectedKeys={[
          pathname === "/admin"
            ? pathname + "/userManage"
            : pathname === "/user"
            ? pathname + "/orderInfo"
            : pathname,
        ]}
        // 子菜单 展开/关闭的回调
        onOpenChange={openChange}
        // 菜单内容
        items={item}
        // 菜单被选中/点击时调用
        onSelect={selectItem}
        onClick={selectItem}
      />
    </Sider>
  );
}
