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

import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useContext } from "react";
import { useState } from "react";
//import { LinkuseLocation } from "react-router-dom";
import axios from "axios";
// import { UserContext } from "../context/userContext";
import Head from "./head";

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
    <div>
      <Head></Head>
      <Card>
        <Card.Body>
          <Row>
            <Col sm={8}>
              <h1>{hotel.hotel_name}</h1>
              <h5 style={{ color: "GrayText" }}>酒店电话：{hotel.hotel_tel}</h5>
              <h5 style={{ color: "GrayText" }}>酒店位置：{hotel.location}</h5>
              <h5 style={{ color: "GrayText" }}>
                酒店详情：{hotel.description}
              </h5>
              {hotel.image_src ? (
                <Row>
                  <Col xs={6} md={4}>
                    <Image
                      src={require(`../img/${hotel.image_src}/1.jpg`)}
                      style={{ width: "100%" }}
                    />
                  </Col>
                  <Col xs={6} md={4}>
                    <Image
                      src={require(`../img/${hotel.image_src}/2.jpg`)}
                      style={{ width: "100%" }}
                    />
                  </Col>
                  <Col xs={6} md={4}>
                    <Image
                      src={require(`../img/${hotel.image_src}/3.jpg`)}
                      style={{ width: "100%" }}
                    />
                  </Col>
                </Row>
              ) : (
                <></>
              )}
            </Col>
            <Col
              sm={4}
              style={{ position: "relative", borderLeft: "1px solid gray" }}
            >
              <h4 style={{ position: "absolute", top: "1rem", right: "1rem" }}>
                评分：<Badge bg="primary">{hotel.star_score}</Badge>
              </h4>

              <h4
                style={{
                  position: "absolute",
                  top: "7rem",
                  right: "6rem",
                  color: "gray",
                  textDecoration: "line-through",
                }}
              >
                ￥{hotel.old_price}
              </h4>
              <h3
                style={{
                  position: "absolute",
                  top: "7rem",
                  right: "1rem",
                  color: "#0d6efd",
                }}
              >
                ￥{hotel.new_price}
              </h3>
              <Button
                on
                variant="primary"
                style={{ position: "absolute", bottom: "1rem", right: "1rem" }}
                href={`/order/${hotelId}`}
              >
                预定
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Index;
