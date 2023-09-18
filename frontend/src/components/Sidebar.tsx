import React from "react";
import {
  HomeOutlined,
  DropboxOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Sider } = Layout;

import { MenuItem, getItem } from "../types";

const items: MenuItem[] = [
  getItem(<Link to="/">Dashboard</Link>, "dashboard", <HomeOutlined />),
  getItem(
    <Link to="/parcels">All Parcels</Link>,
    "parcels",
    <DropboxOutlined />
  ),
  getItem(<Link to="/items">Items</Link>, "items", <BarcodeOutlined />),
  // getItem("User", "sub1", <UserOutlined />, [
  //   getItem("Tom", "3"),
  //   getItem("Bill", "4"),
  //   getItem("Alex", "5"),
  // ]),
  // getItem("Team", "sub2", <TeamOutlined />, [
  //   getItem("Team 1", "6"),
  //   getItem("Team 2", "8"),
  // ]),
];

const Sidebar: React.FC = () => {
  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={(broken) => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={items}
      />
    </Sider>
  );
};

export default Sidebar;
