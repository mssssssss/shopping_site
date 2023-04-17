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
import { formatDate } from "../../utils/dateFormat";
import { orderColumn } from "../../utils/tableColumns";
const { Search } = Input;

export default function OrderManage() {
  const [datas, setDatas] = useState(null); // 表格信息
  const [open, setOpen] = useState(false); // 表单对应的模态框是否显示
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(null); // 表单的初始值
  // eslint-disable-next-line no-extend-native
  // 订单表格的列信息
  const orderColumns = [
    ...orderColumn,
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
            start_date: formatDate(new Date(item.start_date), "yyyy-MM-dd"),
            end_date: formatDate(new Date(item.end_date), "yyyy-MM-dd"),
            room_num: item.room_num,
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
              start_date: formatDate(new Date(item.start_date), "yyyy-MM-dd"),
              end_date: formatDate(new Date(item.end_date), "yyyy-MM-dd"),
              room_num: item.room_num,
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
        columns={orderColumns}
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
