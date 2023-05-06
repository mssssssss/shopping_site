// 路由配置
import { routes } from "./routes";
import { reactLocalStorage } from "reactjs-localstorage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotAuth from "../components/public/notAuth";

export default function MyRouter() {
  // 判断是否有token（是否登录过）
  const token = JSON.stringify(reactLocalStorage.getObject("token")) !== "{}"; // 获得登录的token
  // 判断用户角色
  const role = reactLocalStorage.getObject("role"); //0 表示普通用户，1表示管理员
  console.log("token=", token);
  console.log("role=", role);
  // 注册路由
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
          <Route
            name={route.name}
            path={route.path}
            key={route.name}
            element={
              // 如果路由不需要鉴权 或者 (已经有token了 且登录角色和组件权限一样) 就把组件显示出来
              !route.need || (token && route.permission === role) ? (
                route.component
              ) : (
                // 否则 显示未被授权组件
                // 要先登录才能访问
                <NotAuth></NotAuth>
              )
            }
          >
            {/* 注册当前用户对应的子路由 */}
            {route.children &&
            (!route.need || (token && route.permission === role))
              ? route.children.map((item) => (
                  <Route
                    name={item.name}
                    path={item.path}
                    key={item.name}
                    element={item.component}
                  ></Route>
                ))
              : ""}
          </Route>
        ))}
      </Routes>
    </BrowserRouter>
  );
}
