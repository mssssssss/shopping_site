// 登录表单页
import { Button, Form, Input, message, Select, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import throttle from "../../utils/throttle";

export default function LoginForm() {
  const navigate = useNavigate();
  const { Option } = Select;

  // 对表单提交事件设置节流
  // 表单验证成功后 触发
  const onFinish = async (values) => {
    console.log("Success:", values); //values即为表单信息
    // 验证用户名是否存在
    // 以及验证用户名和密码是否对应上了
    let { data } = await axios.get("/api/checkLogin", {
      params: {
        username: values.username,
        password: values.password,
        role: values.role,
      },
    });
    // 登录失败
    if (data.code !== 200) {
      // return alert(data.message);
      message.error(data.message);
      return;
    }
    // 登录成功
    // 并将用户名/token保存在cookie/localstorage中
    console.log(data);
    reactLocalStorage.setObject(
      "token",
      data.result[0].user_name
      // JSON.stringify(data.result[0].user_name)
    );
    reactLocalStorage.setObject(
      "role",
      data.result[0].user_role
      // JSON.stringify(data.result[0].user_role)
    );
    // 跳转到主页
    message.info("登录成功");
    console.log(data.result[0].user_role === 1);
    // 根据用户角色 如果是普通用户就跳到主页，而管理员就跳转到后台管理页
    if (data.result[0].user_role === 0) {
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      setTimeout(() => {
        // navigate("/admin");
        navigate("/admin/userManage");
      }, 1000);
    }
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={throttle(onFinish)}
    >
      <p style={{ fontSize: 16 }}>账户密码登录</p>
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: "请输入用户名！",
          },
        ]}
      >
        <Input style={{ height: 40, borderRadius: 2 }} placeholder="用户名" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "请输入密码！",
          },
        ]}
      >
        <Input.Password
          style={{ height: 40, borderRadius: 2 }}
          type="password"
          placeholder="登录密码"
        />
      </Form.Item>
      <Form.Item
        name="role"
        rules={[
          {
            required: true,
            message: "请选择角色！",
          },
        ]}
      >
        <Select
          placeholder="请选择登录角色"
          style={{
            width: 320,
            borderRadius: "2px",
          }}
        >
          <Option value="0">普通用户</Option>
          <Option value="1">管理员</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(new Error("请勾选下方协议")),
          },
        ]}
        style={{ minHeight: "10px !important" }}
      >
        <Checkbox ant-select-selector="true" style={{ width: 320 }}>
          我已阅读并同意{" "}
          <a
            style={{ color: "rgb(132, 132, 132)" }}
            target="_blank"
            href="https://contents.ctrip.com/huodong/privacypolicypc/index?type=0"
            rel="noreferrer"
          >
            《服务协议》
          </a>
          和
          <a
            style={{ color: "rgb(132, 132, 132)" }}
            target="_blank"
            rel="noreferrer"
            href="https://contents.ctrip.com/huodong/privacypolicypc/index?type=0"
          >
            《隐私政策》
          </a>
        </Checkbox>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          登录
        </Button>
        <div style={{ textAlign: "right", marginRight: 6, marginTop: 8 }}>
          <a href="/register" style={{ color: "#0086f6" }}>
            免费注册
          </a>
        </div>
      </Form.Item>
    </Form>
  );
}
