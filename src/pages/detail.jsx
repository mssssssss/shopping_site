import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import {
  PhoneOutlined,
  EnvironmentOutlined,
  MessageOutlined,
} from "@ant-design/icons";

import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useContext } from "react";
import { useState } from "react";
//import { LinkuseLocation } from "react-router-dom";
import axios from "axios";
// import { UserContext } from "../context/userContext";
import Head from "./head";
import "./detail.css";
import { Tag } from "antd";

const Index = () => {
  const [hotel, setHotel] = useState([]);

  const location = useLocation();

  const navigate = useNavigate();

  // const { currentUser, logout } = useContext(UserContext);

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

  const handleLogout = (e) => {
    // logout();
    navigate("/");
  };

  return (
    <div style={{ backgroundColor: "rgb(246, 248, 250)" }}>
      <Head></Head>
      <div
        style={{
          width: "90%",
          margin: "0 auto",
        }}
      >
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <Card style={{ border: "none" }}>
            <Card.Body style={{ padding: "20px 40px ", minHeight: "220px" }}>
              <div style={{ display: "flex" }}>
                <div style={{ flex: 1 }}>
                  <p class="hotel_name">{hotel.hotel_name}</p>
                  <div class="hotel_label">
                    <PhoneOutlined />
                    酒店电话：{hotel.hotel_tel}
                  </div>
                  <div class="hotel_label">
                    <EnvironmentOutlined />
                    酒店位置：{hotel.location}
                  </div>
                  <div class="hotel_label">
                    <MessageOutlined />
                    酒店详情：{hotel.description}
                  </div>
                </div>
                <div style={{ width: 200, textAlign: "right" }}>
                  <p style={{}}>
                    评分：<Badge bg="primary">{hotel.star_score}</Badge>
                  </p>
                  <p>
                    <span
                      style={{
                        color: "gray",
                        textDecoration: "line-through",
                      }}
                    >
                      ￥{hotel.old_price}
                    </span>
                    <span
                      style={{
                        color: "#0d6efd",
                        fontSize: "20px",
                      }}
                    >
                      ￥{hotel.new_price}
                    </span>
                  </p>

                  <Button
                    style={{ marginTop: 25 }}
                    variant="primary"
                    className="detailButton"
                    href={`/order/${hotelId}`}
                  >
                    去预定
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div>
          <Card style={{ border: "none", padding: "20px 40px" }}>
            {/* <div> */}
            <p class="hotel_name">图片展示：</p>
            {hotel.image_src ? (
              <>
                <Image
                  className="disPic"
                  src={require(`../img/${hotel.image_src}/1.jpg`)}
                />
                <Image
                  className="disPic"
                  src={require(`../img/${hotel.image_src}/2.jpg`)}
                />
                <Image
                  className="disPic"
                  src={require(`../img/${hotel.image_src}/3.jpg`)}
                />
                <Image
                  className="disPic"
                  src={require(`../img/${hotel.image_src}/4.jpg`)}
                />
              </>
            ) : (
              ""
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Index;
