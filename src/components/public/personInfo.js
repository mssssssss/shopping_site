// 用户或管理员的个人信息页
import { Form, Input, message, Button } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import "../../assets/css/register.css";
// 表单样式
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
export default function PersonInfo() {
  const [form] = Form.useForm(); //当前表单
  const username = reactLocalStorage.getObject("token");
  // 获取当前用户的信息
  useEffect(() => {
    async function getCur() {
      await axios
        .get("/api/getCurrentUser", {
          params: {
            username: username,
          },
        })
        .then((res) => {
          console.log("res", res);
          if (res.data.code === 200) {
            console.log(res.data);
            console.log(res.data.result[0]);
            form.setFieldsValue(res.data.result[0]);
          }
        });
    }
    getCur();
  }, []);

  // 点击更新按钮
  function updateUser() {
    // 表单通过验证后 执行
    form.validateFields().then(async () => {
      // 通过用户名来更新用户的密码, 手机号, 邮箱
      await axios
        .get("/api/updateUser2", {
          params: form.getFieldsValue(),
        })
        .then((res) => {
          console.log(res);
          if (res.data.code === 200) {
            message.info("信息更新成功");
            // 重新渲染表单数据
          }
        });
    });
  }

  return (
    <div>
      <h2 style={{ textAlign: "center", marginLeft: -60 }}>个人信息页</h2>
      <Form
        // initialValue={data}
        {...formItemLayout}
        form={form}
        name="userForm"
        scrollToFirstError
      >
        <Form.Item
          name="user_name"
          label="用户名"
          rules={[
            {
              required: true,
              message: "请输入用户名！",
            },
          ]}
        >
          <Input className="register-item" disabled={1} />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: "请输入密码！",
            },
            () => ({
              validator(_, value) {
                if (!value || value.length >= 6) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("密码长度不小于6"));
              },
            }),
          ]}
        >
          <Input.Password className="register-item" />
        </Form.Item>

        <Form.Item
          name="tel"
          label="手机号"
          rules={[
            {
              required: true,
              message: "请输入手机号码!",
            },
            () => ({
              validator(_, value) {
                var reg_tel =
                  /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/; //11位手机号码正则
                if (!value || value.match(reg_tel)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("手机号码格式不正确！"));
              },
            }),
          ]}
        >
          <Input className="register-item" style={{ width: 320 }} />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "输入的邮箱格式无效！",
            },
            {
              required: true,
              message: "请输入邮箱!",
            },
          ]}
        >
          <Input className="register-item" />
        </Form.Item>
        <div
          style={{ display: "flex", justifyContent: "center", marginLeft: 200 }}
        >
          <Button type="primary" onClick={updateUser}>
            更新
          </Button>
        </div>
      </Form>
    </div>
  );
}
