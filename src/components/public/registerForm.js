// 注册表单页
import { Button, Checkbox, Form, Input, Select, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import throttle from "../../utils/throttle";
import { formItemLayout, tailFormItemLayout } from "../../utils/formLayout";
const { Option } = Select;

export default function RegisterForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    // 看这个角色的用户名是否存在过
    let { data } = await axios.get("/api/findUser", {
      params: {
        username: values.username,
        // role: values.role,
      },
    });
    console.log(data);
    if (data.code !== 200) {
      message.error(data.message);
      return;
    }
    // 否则就 注册新用户
    await axios
      .get("/api/addUser", {
        params: values,
      })
      .then((res) => {
        if (res.data.code === 200) {
          console.log(res.data.message);
          message.info(res.data.message);
          // 跳转到登录页面
          setTimeout(() => {
            navigate("/login");
          }, 1000);
          return;
        }
      });
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );
  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={throttle(onFinish)}
      initialValues={{
        prefix: "86",
      }}
      scrollToFirstError
    >
      <div
        style={{
          display: "flex",
          height: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 20,
            flexGrow: 1,
            textAlign: "center",
            marginLeft: "100px",
          }}
        >
          用户注册
        </div>
        <div style={{ textAlign: "right" }}>
          <a style={{ color: "rgb(132, 132, 132)" }} href="/login">
            已有账户？
          </a>
        </div>
      </div>

      <Form.Item
        name="username"
        label="用户名"
        tooltip="作为登录的唯一标识"
        rules={[
          {
            required: true,
            message: "请输入用户名！",
            whitespace: true,
          },
        ]}
      >
        <Input className="register-item" />
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
        hasFeedback
      >
        <Input.Password className="register-item" />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="确认密码"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "请确认密码！",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("请保证两次输入密码一致！"));
            },
          }),
        ]}
      >
        <Input.Password className="register-item" />
      </Form.Item>

      <Form.Item
        name="phone"
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
        <Input addonBefore={prefixSelector} />
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

      <Form.Item
        name="role"
        label="角色"
        rules={[
          {
            required: true,
            message: "请选择角色！",
          },
        ]}
      >
        <Select
          placeholder="请选择注册的角色"
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
        {...tailFormItemLayout}
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
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit" className="register-btn">
          注册
        </Button>
      </Form.Item>
    </Form>
  );
}
