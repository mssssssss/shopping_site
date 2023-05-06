import React, { createRef } from "react";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import {
  PhoneOutlined,
  EnvironmentOutlined,
  MessageOutlined,
} from "@ant-design/icons";

import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Head from "./head";
import Footer from "./footer";
import "../../assets/css/detail.css";
import holderImg from "../../assets/images/placeholder.gif";

const Index = () => {
  const [hotel, setHotel] = useState([]);

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

  // 实现图片懒加载：只有图片在可视化区域内，才去加载图片
  useEffect(() => {
    // 页面刚加载时 也要显示可视化区域的图片
    setTimeout(() => {
      checkImages();
    }, 1);
    window.addEventListener("scroll", checkImages);
    return () => {
      // 注意在销毁阶段取消监听，减少页面负担
      window.removeEventListener("scroll", checkImages);
    };
  });

  const checkImages = () => {
    // 将dom类数组转换为数组
    var imgs = Array.prototype.slice
      .call(document.querySelectorAll("img"))
      .slice(2);
    console.log(imgs);
    let offsetHeight =
      window.innerHeight || document.documentElement.clientHeight;
    for (let i = 0; i < imgs.length; i++) {
      console.log(imgs[i].getBoundingClientRect().top);
      console.log(offsetHeight);
      if (imgs[i].getBoundingClientRect().top <= offsetHeight) {
        imgs[i].src = imgs[i].getAttribute("datasrc"); //将真实图片地址赋给src
      }
    }
  };

  return (
    <div style={{ backgroundColor: "rgb(246, 248, 250)" }}>
      <Head></Head>
      <div
        style={{
          width: "90%",
          margin: "0 auto",
          marginBottom: 30,
        }}
      >
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <Card style={{ border: "none" }}>
            <Card.Body style={{ padding: "20px 40px " }}>
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
                  <div class="hotel_label" style={{ height: "auto" }}>
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
            <p class="hotel_name">图片展示：</p>
            {hotel.image_src ? (
              <>
                <Image
                  className="disPic"
                  src={holderImg}
                  datasrc={require(`../../assets/images/${hotel.image_src}/1.jpg`)}
                  // src={require(`../../assets/images/${hotel.image_src}/1.jpg`)}
                />
                <Image
                  className="disPic"
                  src={holderImg}
                  datasrc={require(`../../assets/images/${hotel.image_src}/2.jpg`)}
                  // src={require(`../../assets/images/${hotel.image_src}/2.jpg`)}
                />
                <Image
                  className="disPic"
                  // src={require(`../../assets/images/${hotel.image_src}/3.jpg`)}
                  src={holderImg}
                  datasrc={require(`../../assets/images/${hotel.image_src}/3.jpg`)}
                />
                <Image
                  className="disPic"
                  // src={require(`../../assets/images/${hotel.image_src}/4.jpg`)}
                  src={holderImg}
                  datasrc={require(`../../assets/images/${hotel.image_src}/4.jpg`)}
                />
              </>
            ) : (
              ""
            )}
          </Card>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};
export default Index;
