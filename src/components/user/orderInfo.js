// 用户的订单信息页
import { Layout, Button, Tabs, Input, Modal, Form, message } from "antd";
import OrderList from "./orderList";
import { useEffect, useState } from "react";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import "../../assets/css/order.css";

const { Header, Content } = Layout;
const headerStyle = {
  height: 32,
  backgroundColor: "#fff",
  color: "#000",
  fontSize: 16,
  display: "flex",
  alignItems: "center",
  paddingLeft: 32,
  marginTop: "-5px",
};

export default function OrderInfo() {
  let [amount, setAmount] = useState(0); //用户余额
  const username = reactLocalStorage.getObject("token"); //当前用户名
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); //当前表单

  // tab的内容
  const items = [
    {
      key: "1",
      label: `全部订单`,
      children: <OrderList type="all" amount={[amount, setAmount]}></OrderList>,
    },
    {
      key: "2",
      label: `待付款`,
      children: <OrderList type="pay" amount={[amount, setAmount]}></OrderList>,
    },
    {
      key: "3",
      label: `已完成`,
      children: (
        <OrderList type="finish" amount={[amount, setAmount]}></OrderList>
      ),
    },
    {
      key: "4",
      label: `已取消`,
      children: (
        <OrderList type="cancel" amount={[amount, setAmount]}></OrderList>
      ),
    },
  ];

  // 获取当前用户的余额
  async function getMyAmount() {
    await axios
      .get("/api/getCurrentUser", {
        params: {
          username: username,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          console.log(res.data.result[0]);
          setAmount(res.data.result[0].user_balance);
        }
      });
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    // 充值
    form.validateFields().then(async () => {
      // 充值金额
      let money = form.getFieldValue("money");
      console.log(money);
      await axios
        .get("/api/addAmount", {
          params: {
            username: username,
            add: money,
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            message.info("充值成功");
            setAmount(amount + parseInt(money));
            setIsModalOpen(false);
          }
        })
        .catch(() => {
          message.error("充值失败");
        });
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    getMyAmount();
  }, []);

  return (
    <Layout>
      <Header style={headerStyle}>
        <div>钱包余额: {amount} </div>
        <Button onClick={showModal} type="primary" style={{ marginLeft: 20 }}>
          去充值
        </Button>
        <Modal
          title="充值页面"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form}>
            <Form.Item
              label="充值金额"
              name="money"
              rules={[
                { required: true, message: "请输入要充值的金额" },
                () => ({
                  validator(_, value) {
                    if (!value || value > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("请输入一个合法数字！"));
                  },
                }),
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </Form>
        </Modal>
      </Header>
      <Content style={{ backgroundColor: "#fff" }}>
        <Tabs
          defaultActiveKey="1"
          size="large"
          tabBarGutter="10px"
          items={items}
        />
      </Content>
    </Layout>
  );
}
