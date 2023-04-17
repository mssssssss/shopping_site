// 错误页面
import error from "../../assets/images/404.png";
import { Button } from "antd";

export default function NotFound() {
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "calc(100vh - 30px)",
          backgroundSize: "cover",
          backgroundImage: `url(${error})`,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          style={{ position: "absolute", bottom: 50 }}
          ghost
          shape="round"
          href="/"
        >
          回到首页
        </Button>
      </div>
      <div
        style={{
          textAlign: "center",
          color: "#666",
          height: 30,
          lineHeight: "30px",
          fontSize: "14px",
        }}
      >
        Copyright©1999-2023, ctrip.com. all rights reserved.
      </div>
    </>
  );
}
