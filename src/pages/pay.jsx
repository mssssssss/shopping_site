import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { useEffect, useContext, useRef } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext";
import { reactLocalStorage } from "reactjs-localstorage";
import { message } from "antd";

const Pay = () => {
  const navigate = useNavigate();
  // const { currentUser } = useContext(UserContext);
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
  const [hotel, setHotel] = useState([]);
  // const [state, setState] = useState();
  const [userMoney, setUserMoney] = useState();
  const userMoneyRef = useRef(userMoney);
  userMoneyRef.current = userMoney;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/order/${orderId}`);
        setOrder(res.data);
        // setState(res.data.order_state);
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
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand>安全支付</Navbar.Brand>
          <Button variant="primary" href="/orderInfo">
            全部订单
          </Button>
        </Container>
      </Navbar>
      <Card>
        <Card.Body>
          <Container>
            <Row>
              <Col style={{ position: "relative", height: "10rem" }}>
                <h6
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "3rem",
                    display: "inline-block",
                  }}
                >
                  订单金额
                </h6>
                <h3
                  style={{
                    position: "absolute",
                    left: "5rem",
                    top: "2.5rem",
                    display: "inline-block",
                    color: "#0d6efd",
                  }}
                >
                  ￥{order.price}
                </h3>
              </Col>
              <Col
                style={{
                  position: "relative",
                  height: "10rem",
                  borderLeft: "1px solid gray",
                }}
              >
                <h5
                  style={{
                    position: "absolute",
                    left: "2rem",
                    top: "2.5rem",
                    display: "inline-block",
                  }}
                >
                  {order.hotel_name}
                </h5>
                <Button
                  variant="light"
                  style={{
                    position: "absolute",
                    bottom: "1rem",
                    right: "5rem",
                  }}
                  onClick={handleCancel}
                >
                  取消订单
                </Button>
                <Button
                  variant="primary"
                  style={{
                    position: "absolute",
                    bottom: "1rem",
                    right: "1rem",
                  }}
                  onClick={handlePay}
                >
                  支付
                </Button>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Pay;
