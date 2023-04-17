import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
export default function NotAuth() {
  const navigate = useNavigate();
  function toHome() {
    console.log("回到主页");
    navigate("/index");
  }
  function toLogin() {
    console.log("回到登录页");
    navigate("/login");
  }
  return (
    <Result
      status="error"
      title="没有权限！"
      subTitle="If you want to continue, log in first."
      extra={[
        <Button key="console" onClick={toHome}>
          回到主页
        </Button>,
        <Button type="primary" onClick={toLogin} key="login">
          登录
        </Button>,
      ]}
    ></Result>
  );
}
