// 后台系统中 管理员角色对应的用户管理页
import { Table, Button, Space, Input, message, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import UserForm from "./userForm";
const { Search } = Input;

export default function UserManage() {
  const [datas, setDatas] = useState(null); // 表格信息
  const [title, setTitle] = useState(null); //表单标题
  const [type, setType] = useState(null); //表单类型
  const [open, setOpen] = useState(false); // 表单对应的模态框是否显示
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(null); // 表单的初始值

  // 用户表格的列信息
  const columns = [
    {
      title: "用户id",
      dataIndex: "user_id",
      key: "-1",
      width: 80,
      sorter: (a, b) => a.user_id - b.user_id,
    },
    {
      title: "用户身份",
      dataIndex: "role",
      key: "0",
      width: 80,
      sorter: (a, b) => b.role.localeCompare(a.role),
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "1",
      width: 80,
      sorter: (a, b) => {
        // 先按长度排 长度一样再按字典序排
        if (a.username.length !== b.username.length) {
          return a.username.length - b.username.length;
        } else {
          return a.username.localeCompare(b.username);
        }
      },
    },
    {
      title: "密码",
      dataIndex: "password",
      key: "2",
      width: 80,
    },
    {
      title: "电话",
      dataIndex: "phone",
      key: "3",
      width: 100,
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "4",
      width: 100,
      sorter: (a, b) => {
        if (a.email.length !== b.email.length) {
          return a.email.length - b.email.length;
        } else {
          return a.email.localeCompare(b.email);
        }
      },
    },
    {
      title: "余额",
      dataIndex: "amount",
      key: "5",
      width: 60,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "6",
      width: 100,
      fixed: "right",
      render: (_, record, index) => (
        <Space wrap>
          <Button
            onClick={(e) => {
              // e.stopPropagation();
              editUser(record);
            }}
            type="primary"
            size="small"
            icon={<EditOutlined />}
          >
            编辑
          </Button>
          <Popconfirm
            title="Delete"
            description="您确定要删除这个用户吗?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={(e) => {
              deleteUser(record);
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

  // 获取所有用户信息
  const fetchAllData = async () => {
    let newData = [];
    setLoading(true);
    await axios.get("/api/getAllUser").then((res) => {
      if (res.data.code === 200) {
        res.data.result.forEach((item) => {
          newData.push({
            key: item.user_id,
            user_id: item.user_id,
            role: item.user_role === 0 ? "普通用户" : "管理员",
            username: item.user_name,
            password: item.password,
            phone: item.tel,
            email: item.email,
            amount: item.user_balance,
          });
        });
        console.log(newData);
        setDatas(newData);
        setLoading(false);
      }
    });
  };

  // 在页面挂载的时候 获取所有的用户信息
  useEffect(() => {
    fetchAllData();
  }, []); //useEfect的第二个参数： 如果不传递，意思是每次渲染都运行；传递空数组，意思是仅在挂载或卸载时运行；传递一个值，意思是当值更新时执行；..

  const addUser = () => {
    setOpen(true);
    setTitle("新增用户");
    setType("add");
    setInit([]); //设置表单的初始值
  };

  const editUser = (row) => {
    setOpen(true);
    setTitle("编辑用户");
    setType("edit");
    console.log("当前行" + row);
    setInit(row); //设置表单的初始值
  };

  const deleteUser = async (row) => {
    // 通过id删除当前用户
    console.log("删除当前行");
    await axios
      .get("/api/deleteUser", {
        params: {
          id: row.key,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          message.info("删除用户成功");
          // 更新表格信息
          fetchAllData();
        }
      });
  };

  // 点击搜索按钮
  const onSearch = async (value) => {
    console.log(value);
    let newData = [];
    await axios
      .get("/api/getSatisUser", {
        params: {
          username: value,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          // setDatas(res.data.result);
          res.data.result.forEach((item) => {
            newData.push({
              key: item.user_id,
              user_id: item.user_id,
              role: item.user_role === 0 ? "普通用户" : "管理员",
              username: item.user_name,
              password: item.password,
              phone: item.tel,
              email: item.email,
              amount: item.user_balance,
            });
          });
          setDatas(newData);
        }
      });
  };

  return (
    // 搜索栏 按用户名搜索（模糊查询）
    <div>
      <Button onClick={addUser} type="primary" style={{ marginBottom: 16 }}>
        新增用户
      </Button>
      <UserForm
        title={title}
        type={type}
        open={[open, setOpen]}
        init={init}
        tableData={[datas, setDatas]}
      ></UserForm>
      <Search
        style={{
          width: 220,
          float: "right",
        }}
        placeholder="请输入用户名"
        allowClear
        onSearch={onSearch}
        enterButton
      />
      <Table
        columns={columns}
        dataSource={datas}
        scroll={{
          x: 1200,
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
