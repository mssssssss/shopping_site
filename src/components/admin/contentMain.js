// 后台管理主页面的内容栏 在这里设置子路由
import { Navigate, Route, Routes } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import { routes } from "../../router/routes";

// 判断用户角色
const token = JSON.stringify(reactLocalStorage.getObject("token")) !== "{}"; // 获得登录的token
const role = reactLocalStorage.getObject("role"); //0 表示普通用户，1表示管理员
console.log("---", role === 0);
function ContentMain() {
  // 找管理员的子路由信息
  let adminRoutes = (
    <Routes>
      {/* 进入后台页面/admin 默认首先显示用户管理/admin/userManage  */}
      {/* !!! 不能带前缀/admin */}
      {routes
        .filter((item) => item.name === "admin")[0]
        .children.map((route) => (
          <Route
            name={route.name}
            path={route.path}
            key={route.name}
            element={route.component}
          ></Route>
        ))}
    </Routes>
  );

  // 找用户的子路由信息
  let userRoutes = (
    <Routes>
      {routes
        .filter((item) => item.name === "user")[0]
        .children.map((route) => (
          <Route
            name={route.name}
            path={route.path}
            key={route.name}
            element={route.component}
          ></Route>
        ))}
    </Routes>
  );

  return token ? (
    // 根据登录角色 注册不同的路由
    role === 0 ? (
      userRoutes
    ) : (
      adminRoutes
    )
  ) : (
    <Navigate to="/login"></Navigate>
  );
}

export default ContentMain;
