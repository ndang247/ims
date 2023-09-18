import React, { useState } from "react";
import {
  HomeOutlined,
  DropboxOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { MenuItem, getItem } from "../types";
import { Link } from "react-router-dom";

const { Sider } = Layout;

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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
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
