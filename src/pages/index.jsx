import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import { reactLocalStorage } from "reactjs-localstorage";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
// import { UserContext } from "../context/userContext";
import LazyLoad from "react-lazyload";
import holderImg from "../assets/placeholder.gif";
import logo from "../assets/images/logo.jpg";
import { NavLink } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import "../assets/css/header.css";
import {
  Layout,
  Avatar,
  Dropdown,
  Space,
  theme,
  Breadcrumb,
  Input,
} from "antd";
import Head from "./head";
import "./index.css";
import { LikeOutlined } from "@ant-design/icons";
import { Divider, Tag, Rate, List } from "antd";

const Hotel = () => {
  const { Search } = Input;
  const [hotels, setHotels] = useState([]);
  const [inputs, setInputs] = useState({
    hotelName: "",
  });
  const username = reactLocalStorage.getObject("token"); //当前用户名
  console.log(username);
  const sortWay = useLocation().search;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(sortWay);
        const res = await axios.get(`/api/hotel/list${sortWay}`);
        console.log(res.data);
        setHotels(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [sortWay]);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 搜索酒店
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      console.log("input", inputs);
      const res = await axios.post("/api/hotel/search", inputs);
      // const res = await axios.post("/api/hotel/search", value);
      console.log("data", res.data);
      setHotels(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 根据导航地址高亮显示当前排序方式
  const [active, setActive] = useState([false, false, false]);
  useEffect(() => {
    let sort = sortWay.split("=")[1];
    console.log("sort:" + sort);
    if (sortWay === "") {
      console.log("---");
      setActive([true, false, false]);
    } else if (sort === "price") {
      setActive([false, true, false]);
    } else {
      setActive([false, false, true]);
    }
  }, [sortWay]);

  let navigate = useNavigate();
  return (
    <div>
      <Head></Head>
      <div className="sortNav">
        <div className="sortWay">
          <NavLink
            className={() =>
              "nav-link" + (active[0] ? " link_active" : " unlink_active")
            }
          >
            默认排序
          </NavLink>
        </div>
        <div className="sortWay">
          <NavLink
            className={() =>
              "nav-link" + (active[1] ? " link_active" : " unlink_active")
            }
            to="/index?sortWay=price"
          >
            价格（由低到高）
          </NavLink>
        </div>

        <div className="sortWay">
          <NavLink
            className={() =>
              "nav-link" + (active[2] ? " link_active" : " unlink_active")
            }
            to="/index?sortWay=star"
          >
            评价（由高到低）
          </NavLink>
        </div>
        <Form style={{ position: "absolute", marginBottom: 40, right: 80 }}>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="输入酒店名称"
              onChange={handleChange}
              name="hotelName"
              style={{ width: "20rem" }}
            />
            <Button variant="primary" onClick={handleSearch}>
              搜索
            </Button>
          </InputGroup>
        </Form>
      </div>
      <List
        style={{ marginLeft: 20 }}
        itemLayout="vertical"
        size="large"
        pagination={{
          pageSize: 5,
          align: "center",
        }}
        dataSource={hotels}
        renderItem={(hotel) => (
          <List.Item>
            <div style={{ display: "flex" }}>
              <LazyLoad
                placeholder={
                  <img
                    // width="100%"
                    // width="20rem"
                    height="9rem"
                    src={holderImg}
                    alt="logo"
                  />
                }
              >
                <Image
                  src={require(`../img/${hotel.image_src}/1.jpg`)}
                  thumbnail
                  style={{
                    // width: "100%",
                    height: "9rem",
                    border: "none",
                    borderRadius: "10px",
                  }}
                />
              </LazyLoad>
              <div style={{ marginLeft: "35px", marginRight: "35px", flex: 1 }}>
                <div
                  style={{
                    fontSize: "20px",
                    marginTop: "10px",
                    // height: 30,
                    // lineHeight: "30px",
                  }}
                >
                  <span
                    className="hotelTitle"
                    onClick={() => navigate(`/detail/${hotel.hotel_id}`)}
                  >
                    {hotel.hotel_name}
                  </span>
                  <LikeOutlined
                    style={{
                      color: "#f50",
                    }}
                  />
                </div>
                <Rate
                  allowHalf
                  disabled
                  defaultValue={hotel.star_score}
                  style={{ marginleft: "10px", marginBottom: "7px" }}
                />
                <p className="desc">{hotel.description}</p>
              </div>
              <div
                style={{
                  marginRight: "40px",
                  marginTop: 20,
                }}
              >
                <div style={{ fontSize: 16, color: "#333", float: "right" }}>
                  {hotel.label.split(",").map((item) => (
                    <Tag key={item} color="#f50">
                      {item}
                    </Tag>
                  ))}
                  评分：<Badge bg="primary">{hotel.star_score}</Badge>
                </div>

                <div
                  style={{
                    marginTop: 30,
                    marginBottom: 10,
                    textAlign: "right",
                  }}
                >
                  <span
                    style={{
                      color: "gray",
                      textDecoration: "line-through",
                      fontSize: 16,
                    }}
                  >
                    ￥{hotel.old_price}
                  </span>
                  <span style={{ fontSize: 22, color: "rgb(40, 125, 250)" }}>
                    ￥{hotel.new_price}
                  </span>
                </div>
                <Button
                  className="detailButton"
                  style={{ color: "#fff !important" }}
                  // onClick={handleDetail}
                  href={`/detail/${hotel.hotel_id}`}
                >
                  查看详情
                </Button>
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Hotel;
