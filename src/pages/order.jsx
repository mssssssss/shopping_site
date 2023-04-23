import React from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

import { useEffect, useContext } from "react";
import { useState, useRef } from "react";
import { useNavigate, useLocation, Link, Navigate } from "react-router-dom";
//import { LinkuseLocation } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/userContext";

import { DatePicker, Space, InputNumber, Input } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import locale from "antd/es/date-picker/locale/zh_CN";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment";
import { reactLocalStorage } from "reactjs-localstorage";
import Head from "./head";

const Order = () => {
  dayjs.extend(customParseFormat);
  const navigate = useNavigate();

  let [currentUser, setUser] = useState({});
  const username = reactLocalStorage.getObject("token");
  console.log(username);
  // 获取当前用户
  let getCur = async () => {
    await axios
      .get("/api/getCurrentUser", {
        params: {
          username: username,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          console.log("user==", res.data.result[0]);
          setUser(res.data.result[0]);
          setUserMoney(res.data.result[0].user_balance);
        }
      });
  };

  useEffect(() => {
    getCur();
  }, []);

  const [hotel, setHotel] = useState([]);
  const [guest, setGuest] = useState({
    guestName: "",
    guestTel: "",
  });

  const [roomNum, setNum] = useState(0);

  const [date, setDate] = useState([]);

  const [total, setTotal] = useState(0);

  const [maxNum, setMax] = useState(0);
  const maxNumRef = useRef(maxNum);
  maxNumRef.current = maxNum;

  const [orderId, setOrderId] = useState();
  const orderIdRef = useRef(orderId);
  orderIdRef.current = orderId;

  const [userMoney, setUserMoney] = useState();
  const userMoneyRef = useRef(userMoney);
  userMoneyRef.current = userMoney;

  const [inventoryId, setinventoryId] = useState();

  const location = useLocation();

  const hotelId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/hotel/${hotelId}`);
        setHotel(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [hotelId]);

  const disabledDate = (current) => {
    return (
      current > dayjs().endOf("day").add(7, "day") ||
      current < dayjs().endOf("day").add(-1, "day")
    );
  };

  const handleChange = (e) => {
    setGuest((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 总价
  const handleNum = (value) => {
    setNum(value);
    setTotal(hotel.new_price * value);
  };

  // 控制最大预定房间数
  const handleDate = async (date, dateString) => {
    setDate(dateString);
    setMax(0);
    try {
      const res = await axios.post("/api/inventory", { hotelId, dateString });
      setMax(res.data[0].amount);
      setinventoryId(res.data[0].inventory_id);
    } catch (err) {
      console.log(err);
    }
  };

  // 提交订单
  const handleSubmit = async (e) => {
    console.log("执行---");
    //console.log(hotel, guest, roomNum, date);
    if (!date.length) return alert("请填写入住时间");
    if (roomNum.length === 0 || roomNum === 0) return alert("请填写预定房间数");
    if (!guest.guestName) return alert("请填写住客姓名");
    if (!guest.guestTel) return alert("请填写电话号码");
    if (userMoneyRef.current < total) return alert("您的余额不足！");
    console.log("****" + currentUser.user_id);
    // 创建订单
    try {
      console.log(date);
      const res = await axios.post("/api/order", {
        user_id: currentUser.user_id,
        hotel_id: Number(hotelId),
        start_date: date,
        // end_date: date,
        end_date: moment(date).add(1, "days").format("YYYY-MM-DD"),
        room_num: roomNum,
        guest_name: guest.guestName,
        guest_tel: guest.guestTel,
        order_state: 0,
        create_time: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        price: total,
      });
      console.log("---" + res.data.insertId);
      setOrderId(res.data.insertId);
    } catch (err) {
      console.log(err);
    }
    // 减库存
    try {
      axios.put("/api/inventory", {
        amount: maxNumRef.current - roomNum,
        inventory_id: inventoryId,
      });
    } catch (err) {
      console.log(err);
    }
    // 跳转到支付页面
    setTimeout(() => {
      navigate(`/pay/${orderIdRef.current}`);
    }, 1000);
  };
  return (
    <div style={{ backgroundColor: "rgb(246, 248, 250)" }}>
      <Head></Head>
      <div style={{ width: "90%", margin: "0 auto" }}>
        <Card style={{ border: "none", marginTop: "20px" }}>
          <Card.Body>
            <p style={{ fontSize: "24px" }}>酒店信息</p>
            <p style={{ color: "GrayText" }}>酒店名：{hotel.hotel_name}</p>
            <p style={{ color: "GrayText" }}>酒店位置：{hotel.location}</p>
          </Card.Body>
        </Card>
        <Card style={{ border: "none", marginTop: "20px" }}>
          <Card.Body>
            <p style={{ fontSize: "24px" }}>入住信息</p>
            <InputGroup size="md" style={{ position: "relative" }}>
              <InputGroup.Text
                id="inputGroup-sizing-default"
                style={{ width: "10rem" }}
              >
                入住时间
              </InputGroup.Text>
              <Space direction="vertical">
                <DatePicker
                  disabledDate={disabledDate}
                  style={{
                    position: "absolute",
                    height: "100%",
                    width: "20rem",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                  locale={locale}
                  onChange={handleDate}
                >
                  选择入住日期
                </DatePicker>
              </Space>
            </InputGroup>
            <br></br>
            <InputGroup size="md">
              <InputGroup.Text
                id="inputGroup-sizing-default"
                style={{ width: "10rem" }}
              >
                预定房间数
              </InputGroup.Text>
              <InputNumber
                name="roomNum"
                min={0}
                max={maxNumRef.current}
                defaultValue={0}
                onChange={handleNum}
                style={{ width: "20rem" }}
              />
            </InputGroup>
            <br></br>
            <InputGroup size="md" style={{ width: "30rem" }}>
              <InputGroup.Text
                id="inputGroup-sizing-default"
                style={{ width: "10rem" }}
              >
                住客姓名
              </InputGroup.Text>
              <Form.Control
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                name="guestName"
                onChange={handleChange}
              />
            </InputGroup>
            <br></br>
            <InputGroup size="md" style={{ width: "30rem" }}>
              <InputGroup.Text
                id="inputGroup-sizing-default"
                style={{ width: "10rem" }}
              >
                电话号码
              </InputGroup.Text>
              <Form.Control
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                name="guestTel"
                onChange={handleChange}
              />
            </InputGroup>
          </Card.Body>
        </Card>
        <Card
          style={{
            border: "none",
            marginTop: "20px",
            marginBottom: "5px",
            position: "relative",
            height: "6rem",
          }}
        >
          <Card.Body>
            <div
              style={{
                position: "absolute",
                left: "1rem",
                top: "1.5rem",
                display: "inline-block",
              }}
            >
              在线付:
              <span style={{ color: "#0d6efd", fontSize: "2rem" }}>
                ￥{hotel.new_price}
              </span>
              <span>*{roomNum}</span>
            </div>
            <div
              style={{
                position: "absolute",
                right: "10rem",
                top: "1.5rem",
                display: "inline-block",
              }}
            >
              在线付:
              <span style={{ color: "#0d6efd", fontSize: "2rem" }}>
                ￥{total}
              </span>
            </div>
            <Button
              variant="primary"
              style={{ position: "absolute", top: "2.2rem", right: "1.2rem" }}
              onClick={handleSubmit}
            >
              提交订单
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Order;
