// 管理员的用户管理中 增加或编辑用户对应的模态框
import { Modal, Form, Input, Select, message } from "antd";
import axios from "axios";
import { useEffect } from "react";
import "../../assets/css/register.css"
const { Option } = Select;
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

export default function UserForm({ title, type, open, init, tableData }) {
  const [form] = Form.useForm(); //当前表单
  // 获取数据库中所有的用户信息
  const fetchAllData = async () => {
    let newData = [];
    await axios.get("/api/getAllUser").then((res) => {
      if (res.data.code === 200) {
        res.data.result.forEach((item) => {
          newData.push({
            key: item.user_id,
            user_id: item.user_id,
            role: item.user_role === 0 ? "普通用户" : "管理员",
            // role: item.user_role,
            username: item.user_name,
            password: item.password,
            phone: item.tel,
            email: item.email,
            amount: item.user_balance,
          });
        });
        tableData[1](newData);
      }
    });
  };
  // 表单初始值init发生改变时 就重新设置表单
  useEffect(() => {
    console.log("init", init);
    form.setFieldsValue(init);
  }, [init]);
  // 如果是新增表单的话 就置空表单
  if (type === "add") {
    form.resetFields();
  }

  // 根据type的类型 决定显示怎样的表单信息
  // 点击表单的确认按钮
  const handleAddOk = () => {
    // 获取表单数据
    console.log(form.getFieldsValue());
    // 表单验证
    form
      .validateFields()
      .then(async () => {
        if (type === "add") {
          // 添加用户的情况
          // 首先看这个角色的用户名是否存在过
          let { data } = await axios.get("/api/findUser", {
            params: {
              username: form.getFieldsValue().username,
            },
          });
          if (data.code !== 200) {
            message.error(data.message);
          } else {
            // 否则就 注册用户
            await axios
              .get("/api/addUser", {
                params: form.getFieldsValue(),
              })
              .then((res) => {
                if (res.data.code === 200) {
                  console.log(res.data.message);
                  // 更新表格信息
                  //   tableData[1]([]);
                  fetchAllData();
                  message.info("添加用户成功");
                  open[1](false);
                }
              });
          }
        } else {
          // 更新用户的情况
          console.log(form.getFieldsValue());
          // 通过id来更新用户信息
          await axios
            .get("/api/updateUser", {
              params: form.getFieldsValue(),
            })
            .then((res) => {
              if (res.data.code === 200) {
                console.log(res);
                console.log(res.data.message);
                // 更新表格信息
                // tableData[1]([]);
                fetchAllData();
                message.info("更新用户成功");
                open[1](false);
              }
            });
        }
      })
      .catch((err) => {
        message.error("请保证用户信息有效");
      });
  };

  // 点击表单的取消按钮
  const handleAddCancel = () => {
    open[1](false); // 隐藏模态框
  };

  return (
    <Modal
      centered
      title={title}
      open={open[0]}
      onOk={handleAddOk}
      onCancel={handleAddCancel}
      okText="确认"
      cancelText="取消"
      forceRender
    >
      <Form
        // initialValues={init}
        style={{ marginLeft: -80, marginTop: 30 }}
        {...formItemLayout}
        form={form}
        name="userForm"
        // contentEditable="false"
        scrollToFirstError
        // suppressContentEditableWarning
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            {
              required: true,
              message: "请输入用户名！",
              whitespace: true,
            },
          ]}
        >
          <Input className="register-item" disabled={type === "edit" ? 1 : 0} />
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
            <Option value="普通用户">普通用户</Option>
            <Option value="管理员">管理员</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
