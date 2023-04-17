// 登录页
import bg from "../../assets/images/bg.jpg";
import "../../assets/css/login.css";
import React from "react";
import Header from "./header";
import LoginForm from "./loginForm";
import Footer from "./footer";

export default function Login() {
  return (
    <div>
      <Header></Header>
      <div
        className="mid-content"
        style={{
          backgroundImage: `url(${bg})`,
        }}
      >
        <div className="form">
          <LoginForm></LoginForm>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
