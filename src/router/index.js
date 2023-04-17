// 路由配置
import { routes } from "./routes";
import { reactLocalStorage } from "reactjs-localstorage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export default function MyRouter() {
  // 判断是否有token（是否登录过）
  const token = JSON.stringify(reactLocalStorage.getObject("token")) !== "{}"; // 获得登录的token
  // 判断用户角色
  const role = JSON.stringify(reactLocalStorage.getObject("role")); //0 表示普通用户，1表示管理员
  console.log("token=", token);
  console.log("role=", role);
  // 显示组件
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
                // token
                route.component
              ) : (
                // 否则 要先登录才能访问
                // message.error("请先登录")
                <Navigate to="/login" state={{}}></Navigate>
              )
            }
          ></Route>
        ))}
      </Routes>
    </BrowserRouter>
  );
}
