// 后台系统中 管理员角色对应的订单管理页
import { Table, Button, Space, Input, message, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import OrderForm from "./orderForm";
import axios from "axios";
const { Search } = Input;

export default function OrderManage() {
  const [datas, setDatas] = useState(null); // 表格信息
  const [open, setOpen] = useState(false); // 表单对应的模态框是否显示
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(null); // 表单的初始值
  // eslint-disable-next-line no-extend-native
  Date.prototype.format = function (fmt) {
    var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      S: this.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
      }
    }
    return fmt;
  };

  // 订单表格的列信息
  const columns = [
    {
      title: "订单id",
      dataIndex: "order_id",
      key: "0",
      width: 70,
      sorter: (a, b) => a.order_id - b.order_id,
    },
    {
      title: "用户id",
      dataIndex: "user_id",
      key: "1",
      width: 70,
      sorter: (a, b) => a.user_id - b.user_id,
    },
    {
      title: "酒店id",
      dataIndex: "hotel_id",
      key: "2",
      width: 70,
      sorter: (a, b) => a.hotel_id - b.hotel_id,
    },
    {
      title: "预定开始日期",
      dataIndex: "start_date",
      key: "3",
      width: 110,
      sorter: (a, b) => a.start_date.localeCompare(b.start_date),
    },
    {
      title: "预定结束日期",
      dataIndex: "end_date",
      key: "4",
      width: 110,
      sorter: (a, b) => a.end_date.localeCompare(b.end_date),
    },
    {
      title: "预定房间数量",
      dataIndex: "room_num",
      key: "5",
      width: 100,
      sorter: (a, b) => a.room_num - b.room_num,
    },
    {
      title: "预订人姓名",
      dataIndex: "guest_name",
      key: "6",
      width: 100,
      sorter: (a, b) => {
        if (a.guest_name.length !== b.guest_name.length) {
          return a.guest_name.length - b.guest_name.length;
        } else {
          return a.guest_name.localeCompare(b.guest_name);
        }
      },
    },
    {
      title: "预定人电话",
      dataIndex: "guest_tel",
      key: "7",
      width: 100,
      sorter: (a, b) => a.guest_tel.localeCompare(b.guest_tel),
    },
    {
      title: "订单状态",
      dataIndex: "order_state",
      key: "8",
      width: 90,
      sorter: (a, b) => a.order_state - b.order_state,
    },
    {
      title: "订单创建时间",
      dataIndex: "create_time",
      key: "9",
      width: 120,
      sorter: (a, b) => a.create_time.localeCompare(b.create_time),
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "10",
      width: 120,
      fixed: "right",
      render: (_, record, index) => (
        <Space wrap>
          <Button
            onClick={(e) => {
              editOrder(record);
            }}
            type="primary"
            size="small"
            icon={<EditOutlined />}
          >
            编辑
          </Button>
          <Popconfirm
            title="Delete"
            description="您确定要删除这个订单吗?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={(e) => {
              deleteOrder(record);
            }}
          >
            <Button
              type="primary"
              size="small"
              icon={<DeleteOutlined />}
              danger
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 获取所有的订单信息
  const fetchAllOrder = async () => {
    let newData = [];
    setLoading(true);
    await axios.get("/api/getAllOrder").then((res) => {
      if (res.data.code === 200) {
        res.data.result.forEach((item) => {
          newData.push({
            key: item.order_id,
            order_id: item.order_id,
            user_id: item.user_id,
            hotel_id: item.hotel_id,
            // start_date: new Date(item.start_date).format("yyyy-MM-dd hh:mm:ss"),
            // end_date: new Date(item.end_date).format("yyyy-MM-dd hh:mm:ss"),
            start_date: new Date(item.start_date).format("yyyy-MM-dd"),
            end_date: new Date(item.end_date).format("yyyy-MM-dd"),
            room_num: item.room_num,
            guest_name: item.guest_name,
            guest_tel: item.guest_tel,
            order_state:
              item.order_state === 0
                ? "待支付"
                : item.order_state === 1
                ? "已完成"
                : "已取消", // 这个没确定好 0-待支付 1-已完成 2-已取消
            create_time: new Date(item.create_time).format(
              "yyyy-MM-dd hh:mm:ss"
            ),
          });
        });
        setDatas(newData);
        setLoading(false);
      }
    });
  };

  // 在页面挂载时 获取所有的订单信息 并赋给datas
  useEffect(() => {
    fetchAllOrder();
  }, []);

  // 点击编辑按钮
  const editOrder = (row) => {
    setOpen(true);
    // console.log("当前行" + row);
    setInit(row); //设置表单的初始值
  };

  const deleteOrder = async (row) => {
    // 通过id删除当前订单
    console.log("删除当前行");
    await axios
      .get("/api/deleteOrder", {
        params: {
          id: row.order_id,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          message.info("删除订单成功");
          // 更新表格信息
          fetchAllOrder();
        }
      });
  };

  // 点击搜索按钮
  // 通过预订人姓名来搜索订单
  const onSearch = async (value) => {
    console.log(value);
    let newData = [];
    await axios
      .get("/api/getSatisOrder", {
        params: {
          guest_name: value,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          // setDatas(res.data.result);
          res.data.result.forEach((item) => {
            newData.push({
              key: item.order_id,
              order_id: item.order_id,
              user_id: item.user_id,
              hotel_id: item.hotel_id,
              start_date: new Date(item.start_date).format("yyyy-MM-dd"),
              end_date: new Date(item.end_date).format("yyyy-MM-dd"),
              room_num: item.room_num,
              guest_name: item.guest_name,
              guest_tel: item.guest_tel,
              order_state:
                item.order_state === 0
                  ? "待支付"
                  : item.order_state === 1
                  ? "已完成"
                  : "已取消", // 这个没确定好 0-待支付 1-已完成 2-已取消
              create_time: new Date(item.create_time).format(
                "yyyy-MM-dd hh:mm:ss"
              ),
            });
          });
          setDatas(newData);
        }
      });
  };

  return (
    // 搜索栏 按用户名搜索（模糊查询）
    <div>
      <OrderForm
        open={[open, setOpen]}
        init={init}
        tableData={[datas, setDatas]}
      ></OrderForm>
      <Search
        style={{
          width: 220,
          float: "right",
          marginBottom: 16,
        }}
        placeholder="请输入预订人姓名"
        allowClear
        onSearch={onSearch}
        enterButton
      />
      <Table
        columns={columns}
        dataSource={datas}
        scroll={{
          x: 1800,
        }}
        // size="middle"
        sticky
        pagination={{
          pageSize: 5, //设置每页显示6行数据
        }}
        loading={loading}
      />
    </div>
  );
}
