import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import { message } from "antd";
import Head from "./head";
import Footer from "./footer";

const Pay = () => {
  const navigate = useNavigate();
  let [currentUser, setUser] = useState({});
  const username = reactLocalStorage.getObject("token");
  async function getCur() {
    await axios
      .get("/api/getCurrentUser", {
        params: {
          username: username,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          console.log("---" + res.data.result[0]);
          setUser(res.data.result[0]);
        }
      });
  }
  useEffect(() => {
    getCur();
    console.log("curUser", currentUser);
  }, []);

  const location = useLocation();
  const orderId = location.pathname.split("/")[2];

  const [order, setOrder] = useState([]);
  const [userMoney, setUserMoney] = useState();
  const userMoneyRef = useRef(userMoney);
  userMoneyRef.current = userMoney;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/order/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [orderId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/user/${currentUser.user_id}`);
        setUserMoney(res.data.user_balance);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [currentUser]);

  // 取消
  const handleCancel = async (e) => {
    try {
      await axios.get("/api/cancelOrder", {
        params: {
          order_id: orderId,
        },
      });
    } catch (err) {
      console.log(err);
    }
    message.info("您已取消订单");
    setTimeout(() => {
      navigate("/user");
    }, 2000);
    return;
  };

  // 支付
  const handlePay = async (e) => {
    if (userMoneyRef.current < order.price) return alert("您的余额不足");
    try {
      const state = 1;
      await axios.put(`/api/order/${orderId}`, { state });
    } catch (err) {
      console.log(err);
    }
    const money = userMoneyRef.current - order.price;
    try {
      //console.log(money);
      await axios.put(`/api/user/${currentUser.user_id}`, { money });
    } catch (err) {
      console.log(err);
    }
    message.info("您已成功支付");
    setTimeout(() => {
      navigate("/user");
    }, 2000);
    return;
  };

  return (
    <div>
      <Head></Head>
      <Card
        style={{
          border: "none",
          backgroundColor: "rgb(246, 248, 250)",
          paddingTop: "20px",
        }}
      >
        <Card.Body>
          <Container>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "15px",
                marginTop: "20px",
              }}
            >
              <h3>订单信息确认：</h3>
              <div style={{ height: 30, lineHeight: "30px" }}>
                预约酒店：{order.hotel_name}
              </div>
              <div style={{ height: 30, lineHeight: "30px" }}>
                预约时间：{order.start_date} ~ {order.end_date}
              </div>
              <div style={{ height: 30, lineHeight: "30px" }}>
                预订房间数：{order.room_num}
              </div>
              <div style={{ height: 30, lineHeight: "30px" }} s>
                预订人电话：{order.guest_tel}
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "15px",
                marginTop: "25px",
                marginBottom: "18px",
              }}
            >
              <h3>付款信息确认：</h3>
              <div style={{ height: 40, lineHeight: "40px" }}>
                <span style={{ fontSize: 18 }}>订单金额：</span>
                <span
                  style={{
                    fontSize: 24,
                    color: "#0d6efd",
                  }}
                >
                  ￥{order.price}
                </span>
              </div>

              <div style={{ height: 60, lineHeight: "60px" }}>
                <Button
                  // variant="light"
                  variant="dark"
                  onClick={handleCancel}
                  style={{ marginRight: "15px" }}
                >
                  取消订单
                </Button>
                <Button variant="primary" onClick={handlePay}>
                  支付订单
                </Button>
              </div>
            </div>
          </Container>
        </Card.Body>
      </Card>
      <Footer></Footer>
    </div>
  );
};

export default Pay;
