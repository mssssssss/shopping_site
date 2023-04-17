// 注册页面
import Header from "./header";
import RegisterForm from "./registerForm";
import Footer from "./footer";
import "../../assets/css/register.css";

export default function Register() {
  return (
    <div>
      <Header></Header>
      <div className="mid-content-2">
        <div className="regi-form">
          <RegisterForm></RegisterForm>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
