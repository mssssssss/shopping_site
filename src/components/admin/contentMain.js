// 后台管理主页面的内容栏 在这里设置子路由
import { Navigate, Route, Routes } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import { routes } from "../../router/routes";

const token = JSON.stringify(reactLocalStorage.getObject("token")) !== "{}"; // 获得登录的token
// 判断用户角色
const role = JSON.stringify(reactLocalStorage.getObject("role")); //0 表示普通用户，1表示管理员
console.log(role);
console.log("didid", role === "1");
// console.log(routes.filter((item) => item.name === "admin"));
function ContentMain() {
  let adminRoutesInfo = routes.filter((item) => item.name === "admin")[0]
    .children;

  let userRoutesInfo = routes.filter((item) => item.name === "user")[0]
    .children;
  console.log("111");
  // 找管理员的子路由信息
  let adminRoutes = (
    <Routes>
      {/* 进入后台页面/admin 默认首先显示用户管理/admin/userManage  */}
      {/* !!! 不能带前缀/admin */}
      {adminRoutesInfo.map((route) => (
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
      {userRoutesInfo.map((route) => (
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
    role === "0" ? (
      userRoutes
    ) : (
      adminRoutes
    )
  ) : (
    <Navigate to="/login"></Navigate>
  );
}

export default ContentMain;
