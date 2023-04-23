// 订单表格的列信息
const orderColumn = [
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
    title: "订单金额",
    dataIndex: "price",
    key: "5",
    width: 100,
    sorter: (a, b) => a.price - b.price,
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
];

// 用户表格的列信息
const userColumn = [
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
];
export { orderColumn, userColumn };
