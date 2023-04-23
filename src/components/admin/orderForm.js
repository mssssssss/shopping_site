// 管理员的订单管理中 编辑订单对应的模态框
import { Modal, Form, Input, Select, message, DatePicker } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import locale from "antd/es/date-picker/locale/zh_CN";
import axios from "axios";
import { useEffect } from "react";
import { formItemLayout } from "../../utils/formLayout";
import { formatDate } from "../../utils/dateFormat";
import "../../assets/css/register.css";
const { Option } = Select;

export default function UserForm({ open, init, tableData }) {
  const [form] = Form.useForm(); //当前表单
  // 获取数据库中所有的订单信息
  const fetchAllOrder = async () => {
    let newData = [];
    await axios.get("/api/getAllOrder").then((res) => {
      if (res.data.code === 200) {
        res.data.result.forEach((item) => {
          newData.push({
            key: item.order_id,
            order_id: item.order_id,
            user_id: item.user_id,
            hotel_id: item.hotel_id,
            start_date: formatDate(new Date(item.start_date), "yyyy-MM-dd"),
            end_date: formatDate(new Date(item.end_date), "yyyy-MM-dd"),
            room_num: item.room_num,
            price: item.price,
            guest_name: item.guest_name,
            guest_tel: item.guest_tel,
            order_state:
              item.order_state === 0
                ? "待支付"
                : item.order_state === 1
                ? "已完成"
                : "已取消", // 这个没确定好 0-待支付 1-已完成 2-已取消
            create_time: formatDate(
              new Date(item.create_time),
              "yyyy-MM-dd hh:mm:ss"
            ),
          });
        });
        tableData[1](newData);
      }
    });
  };

  // 表单初始值init发生改变时 就重新设置表单
  useEffect(() => {
    console.log("init", init);
    if (init) {
      form.setFieldsValue({
        ...init,
        // 设置开始和结束时间 dataPicker组件只接受dayjs类型的数据
        start_date: dayjs(init.start_date, "YYYY-MM-DD "),
        end_date: dayjs(init.end_date, "YYYY-MM-DD"),
      });
    }
  }, [init]);

  // 设置今天之前的时间都不可选择
  //   const disabledDate = (current) => {
  //     return current < moment().startOf("day");
  //   };

  // 点击表单的确认按钮
  const handleAddOk = () => {
    // 获取表单数据
    console.log(form.getFieldsValue());
    // 表单验证
    form
      .validateFields()
      .then(async () => {
        // 更新订单的情况
        console.log(form.getFieldsValue());
        let start = dayjs(
          JSON.parse(JSON.stringify(form.getFieldValue("start_date")))
        ).format("YYYY-MM-DD");

        let end = dayjs(
          JSON.parse(JSON.stringify(form.getFieldValue("end_date")))
        ).format("YYYY-MM-DD");
        // 通过order_id来更新订单信息
        await axios
          .get("/api/updateOrder", {
            params: {
              ...form.getFieldsValue(),
              start_date: start, //将dayjs类型的数据转换为datetime 以插入到数据库中
              end_date: end,
              order_state:
                form.getFieldValue("order_state") === "待支付"
                  ? 0
                  : form.getFieldValue("order_state") === "已完成"
                  ? 1
                  : 2,
            },
          })
          .then((res) => {
            if (res.data.code === 200) {
              console.log(res.data.message);
              message.info("更新订单成功");
              open[1](false);
              fetchAllOrder();
            }
          });
      })
      .catch((err) => {
        message.error("请保证订单信息有效");
      });
  };

  // 点击表单的取消按钮
  const handleAddCancel = () => {
    open[1](false); // 隐藏模态框
  };

  return (
    <Modal
      centered
      title="编辑订单"
      open={open[0]}
      onOk={handleAddOk}
      onCancel={handleAddCancel}
      okText="确认"
      cancelText="取消"
      forceRender
    >
      <Form
        style={{ marginLeft: -80, marginTop: 30 }}
        {...formItemLayout}
        form={form}
        name="orderForm"
        scrollToFirstError
      >
        <Form.Item label="订单id" name="order_id" hidden="true">
          <Input className="register-item" />
        </Form.Item>
        <Form.Item
          label="预定开始日期"
          name="start_date"
          rules={[
            {
              required: true,
              message: "请输入开始日期！",
            },
          ]}
        >
          <DatePicker
            className="register-item"
            locale={locale}
            placeholder="选择开始日期"
            // showTime
            // disabledDate={disabledDate}
          />
        </Form.Item>

        <Form.Item
          label="预定结束日期"
          name="end_date"
          rules={[
            {
              required: true,
              message: "请输入结束日期！",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                let start = dayjs(getFieldValue("start_date")).format(
                  "YYYY-MM-DD"
                );
                let end = dayjs(value).format("YYYY-MM-DD");
                console.log(start);
                console.log(end);
                if (!value || start.localeCompare(end) < 0) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("请保证结束日期大于开始日期！")
                );
              },
            }),
          ]}
        >
          <DatePicker
            className="register-item"
            locale={locale}
            placeholder="选择结束日期"
            // showTime
            // disabledDate={disabledDate}
          />
        </Form.Item>

        <Form.Item
          name="room_num"
          label="预定房间数量"
          rules={[
            {
              required: true,
              message: "请输入数量！",
            },
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
          <Input type="number" className="register-item" />
        </Form.Item>

        <Form.Item
          name="guest_name"
          label="预订人姓名"
          rules={[
            {
              required: true,
              message: "请输入预订人姓名!",
            },
          ]}
        >
          <Input className="register-item" />
        </Form.Item>

        <Form.Item
          name="guest_tel"
          label="预订人电话"
          rules={[
            {
              required: true,
              message: "请输入预订人电话!",
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
          name="order_state"
          label="订单状态"
          rules={[
            {
              required: true,
              message: "请选择订单状态！",
            },
          ]}
        >
          <Select
            placeholder="请选择订单状态"
            style={{
              width: 320,
              borderRadius: "2px",
            }}
          >
            <Option value="待支付">待支付</Option>
            <Option value="已完成">已完成</Option>
            <Option value="已取消">已取消</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
