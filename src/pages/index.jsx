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
import { Layout, Avatar, Dropdown, Space, theme, Breadcrumb } from "antd";
import Head from "./head";
import "./index.css";

const Hotel = () => {
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

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/hotel/search", inputs);
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

  return (
    <>
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
      </div>
      {hotels.map((hotel) => (
        <Row key={hotel.hotel_id}>
          <Col sm={8}>
            <Row>
              <Col>
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="15rem"
                      src={holderImg}
                      alt="logo"
                    />
                  }
                >
                  <Image
                    src={require(`../img/${hotel.image_src}/1.jpg`)}
                    thumbnail
                    style={{ width: "100%", height: "15rem" }}
                  />
                </LazyLoad>
              </Col>
              <Col>
                <Card style={{ height: "15rem", position: "relative" }}>
                  <Card.Body>
                    <h1>{hotel.hotel_name}</h1>
                    <h5
                      style={{
                        position: "absolute",
                        top: "6rem",
                        left: "1rem",
                      }}
                    >
                      {hotel.description}
                    </h5>
                    <Badge
                      bg="warning"
                      text="dark"
                      style={{
                        position: "absolute",
                        top: "10rem",
                        left: "1rem",
                      }}
                    >
                      {hotel.label}
                    </Badge>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col sm={4}>
            <Card
              style={{ height: "15rem", position: "relative" }}
              text="primary"
            >
              <Card.Body>
                <h6
                  style={{ position: "absolute", top: "1rem", right: "1rem" }}
                >
                  评分：<Badge bg="primary">{hotel.star_score}</Badge>
                </h6>
                <h4
                  style={{
                    position: "absolute",
                    top: "5rem",
                    right: "6rem",
                    color: "gray",
                    textDecoration: "line-through",
                  }}
                >
                  ￥{hotel.old_price}
                </h4>
                <h3
                  style={{ position: "absolute", top: "5rem", right: "1rem" }}
                >
                  ￥{hotel.new_price}
                </h3>
                <Button
                  variant="primary"
                  style={{ position: "absolute", top: "9rem", right: "1rem" }}
                  // onClick={handleDetail}
                  href={`/detail/${hotel.hotel_id}`}
                >
                  查看详情
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ))}
    </>
  );
};

export default Hotel;
