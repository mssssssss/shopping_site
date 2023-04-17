import { List, Button, Popconfirm, message } from "antd";
import React, { useEffect, useState } from "react";
import { HomeFilled, QuestionCircleOutlined } from "@ant-design/icons";
import { reactLocalStorage } from "reactjs-localstorage";
import ErrorBoundary from "../../utils/errorBoundary";
import axios from "axios";

// 计算两个日期之间相隔的天数
function DateDiff(sDate1, sDate2) {
  //sDate1和sDate2是2006-12-18格式
  var aDate1, aDate2, oDate1, oDate2, iDays;
  aDate1 = sDate1.split("-");
  oDate1 = new Date(aDate1[1] + "/" + aDate1[2] + "/" + aDate1[0]);
  aDate2 = sDate2.split("-");
  oDate2 = new Date(aDate2[1] + "/" + aDate2[2] + "/" + aDate2[0]);
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24);
  return iDays;
}

const username = reactLocalStorage.getObject("token"); // 得到当前用户的用户名
export default function OrderList({ type, amount }) {
  let [datas, setDatas] = useState([]);
  // 通过传递过来的不同参数 获取用户的不同种类的订单信息
  async function getOrderInfo() {
    if (type === "all") {
      // 获取所有订单
      await axios
        .get("/api/getMyAllOrder", {
          params: {
            username: username,
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            setDatas(res.data.result);
          }
        });
    } else if (type === "pay") {
      // 获取所有未支付的订单 order_state=0
      await axios
        .get("/api/getMyUnPayOrder", {
          params: {
            username: username,
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            setDatas(res.data.result);
          }
        });
      // setDatas(null); //故意设置一个错误 ？错误闪现？ => 可能是因为处在开发环境
    } else if (type === "finish") {
      // 获取所有已完成的订单 order_state=1
      await axios
        .get("/api/getMyFinishOrder", {
          params: {
            username: username,
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            setDatas(res.data.result);
          }
        });
    } else {
      // 获取所有已取消的订单 order_state=2
      await axios
        .get("/api/getMyCancelOrder", {
          params: {
            username: username,
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            setDatas(res.data.result);
          }
        });
    }
  }

  // 取消订单
  function cancelOrder(id) {
    console.log(id);
    // 通过订单Id取消订单（即将订单状态置为2）
    axios
      .get("/api/cancelOrder", {
        params: {
          order_id: id,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          console.log("取消了订单");
          message.info("订单取消成功");
          // 更新list的数据
          getOrderInfo();
        }
      });
  }

  // 支付订单
  // 要判断当前余额是否足够支付订单金额
  function payOrder(id, needPay) {
    console.log(id);
    console.log("当前余额", amount[0]);
    console.log("需要支付", needPay);
    // 如果当前余额够支付
    if (amount[0] >= needPay) {
      // 支付订单
      // 通过订单id，来修改订单状态和余额
      axios
        .get("/api/payOrder", {
          params: {
            order_id: id,
            amount: amount[0] - needPay, // 支付后的余额
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            console.log("支付了订单");
            // 更新list的数据
            getOrderInfo();
            amount[1](amount[0] - needPay);
            message.info("订单支付成功");
          }
        });
    } else {
      message.error("当前余额不足,请先充值！");
    }
  }

  useEffect(() => {
    getOrderInfo();
  }, []);

  return (
    // <ErrorBoundary>
    <List
      itemLayout="vertical"
      size="large"
      pagination={{
        pageSize: 3,
      }}
      dataSource={datas}
      renderItem={(item) => (
        <List.Item
          key={item.order_id}
          extra={
            <div style={{ fontSize: 16, textAlign: "right" }}>
              {item.order_state === 2 ? (
                <div style={{ color: "rgba(0, 0, 0, 0.45)" }}>已取消</div>
              ) : (
                <div style={{ color: "rgb(22, 119, 255)" }}>
                  {item.order_state === 0 ? "未支付" : "已完成"}
                </div>
              )}

              <div>
                {item.order_state !== 2 ? (
                  <span style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.45)" }}>
                    在线付
                  </span>
                ) : (
                  <></>
                )}

                <span style={{ fontWeight: "bold" }}>
                  ￥
                  {item.new_price *
                    DateDiff(item.end_date, item.start_date) *
                    item.room_num}
                </span>
              </div>
              {/* 如果订单为未支付的状态，则可以显示支付和取消的按钮 */}
              {item.order_state === 0 ? (
                <div style={{ marginTop: 40, marginBottom: 10 }}>
                  <Popconfirm
                    title="Delete"
                    description="您确定要删除这个订单吗?"
                    icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                    onConfirm={(e) => {
                      cancelOrder(item.order_id);
                    }}
                  >
                    <Button>取消</Button>
                  </Popconfirm>

                  <Button
                    onClick={() =>
                      payOrder(
                        item.order_id,
                        item.new_price *
                          DateDiff(item.end_date, item.start_date) *
                          item.room_num
                      )
                    }
                    type="primary"
                    style={{ marginLeft: 10 }}
                  >
                    支付
                  </Button>
                </div>
              ) : (
                <></>
              )}
            </div>
          }
        >
          <List.Item.Meta
            avatar={<HomeFilled style={{ color: "rgb(22, 119, 255)" }} />}
            title={<a href={item.href}>{item.hotel_name}</a>}
            style={{ marginBottom: "0px !important" }}
          />
          <div style={{ color: "rgba(0, 0, 0, 0.45)", marginTop: "-20px" }}>
            <div>{item.location}</div>
            <div style={{ display: "flex", color: "rgba(0, 0, 0, 0.45)" }}>
              <div>
                {item.start_date} 至 {item.end_date}
              </div>
              <div style={{ marginLeft: 10 }}>
                {DateDiff(item.end_date, item.start_date)} 晚 / {item.room_num}
                间
              </div>
            </div>
            <div>订单创建时间: {item.create_time}</div>
          </div>
        </List.Item>
      )}
    />
    //  </ErrorBoundary>
  );
}
