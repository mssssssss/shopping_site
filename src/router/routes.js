import { Navigate } from "react-router-dom";
import React from "react";
import Index from "../components/user/index";
import withLoading from "../utils/withLoading";
// 懒加载路由
const Register = React.lazy(() => import("../components/public/register"));
const Login = React.lazy(() => import("../components/public/login"));
const NotFound = React.lazy(() => import("../components/public/notFound"));
const Main = React.lazy(() => import("../components/admin/main"));
const UserManage = React.lazy(() => import("../components/admin/userManage"));
const OrderManage = React.lazy(() => import("../components/admin/orderManage"));
const PersonInfo = React.lazy(() => import("../components/public/personInfo"));
const OrderInfo = React.lazy(() => import("../components/user/orderInfo"));

// 路由配置信息
const routes = [
  // 通用路由
  {
    name: "default",
    path: "/",
    component: <Navigate to="/index" />,
    // 是否要完全匹配
    // exact: true,
    // 是否需要鉴权（是否需要有token才能访问）
    need: false,
  },
  {
    name: "index",
    path: "/index",
    component: <Index />,
    need: false,
  },
  {
    name: "register",
    path: "/register",
    component: withLoading(<Register />),
    need: false,
  },
  {
    name: "login",
    path: "/login",
    component: withLoading(<Login />),
    need: false,
  },
  {
    name: "notFound",
    path: "*",
    component: withLoading(<NotFound />),
    need: false,
  },

  // 用户管理相关路由
  {
    name: "user",
    path: "/user/*",
    component: withLoading(<Main />),
    need: true,
    permission: "0",
    children: [
      {
        name: "user-index",
        path: "/",
        component: <Navigate to="/user/orderInfo"></Navigate>,
      },
      {
        name: "订单信息",
        path: "/orderInfo",
        component: withLoading(<OrderInfo />),
      },
      {
        name: "个人信息",
        path: "/personInfo",
        component: withLoading(<PersonInfo />),
      },
    ],
  },

  // 管理员相关路由
  {
    name: "admin",
    path: "/admin/*",
    component: <Main />,
    need: true,
    permission: "1",
    children: [
      {
        name: "admin-index",
        path: "/",
        component: <Navigate to="/admin/userManage"></Navigate>,
      },
      {
        name: "用户管理",
        path: "/userManage",
        component: withLoading(<UserManage />),
        isSubMenu: true, //标记为 是侧边栏菜单
      },
      {
        name: "订单管理",
        path: "/orderManage",
        component: withLoading(<OrderManage />),
        isSubMenu: true,
      },
      {
        name: "个人信息",
        path: "/personInfo",
        component: withLoading(<PersonInfo />),
      },
    ],
  },
];

export { routes };
