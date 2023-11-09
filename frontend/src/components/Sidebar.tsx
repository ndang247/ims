import React from "react";
import {
  HomeOutlined,
  DropboxOutlined,
  BarcodeOutlined,
  UserOutlined,
  AuditOutlined,
  MenuFoldOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { ISidebarProps } from "../types";

const { Sider } = Layout;

import { MenuItem, getMenuItem } from "../types";
import Logo from "../assets/logo.svg";

const managerItems: MenuItem[] = [
  getMenuItem(<Link to="/">Dashboard</Link>, "dashboard", <HomeOutlined />),
  getMenuItem(
    <Link to="/parcels">All Parcels</Link>,
    "parcels",
    <DropboxOutlined />
  ),
  getMenuItem(<Link to="/items">Items</Link>, "items", <BarcodeOutlined />),
  getMenuItem(<Link to="/inbound">Inbound</Link>, "inbound", <LoginOutlined />),
  getMenuItem("Manage", "sub1", <MenuFoldOutlined />, [
    getMenuItem(
      <Link to="/outbound">Outbound</Link>,
      "outbound",
      <LogoutOutlined />
    ),
    getMenuItem(<Link to="/users">User</Link>, "users", <UserOutlined />),
    getMenuItem(
      <Link to="/outlet">Outlet Order</Link>,
      "outlet_orders",
      <AuditOutlined />
    ),
  ]),
];

const outletItems: MenuItem[] = [
  getMenuItem(
    <Link to="/new-order">New Order</Link>,
    "new_order",
    <DropboxOutlined />
  ),
  getMenuItem(
    <Link to="/orders">All Orders</Link>,
    "orders",
    <BarcodeOutlined />
  ),
];

const Sidebar: React.FC<ISidebarProps> = ({ role }) => {
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
      <div className="logo-vertical">
        <img src={Logo} alt="ims-logo" />
      </div>
      <Menu
        theme="dark"
        defaultSelectedKeys={[
          `${role === "manager" ? "dashboard" : "new_order"}`,
        ]}
        mode="inline"
        items={role === "manager" ? managerItems : outletItems}
      />
    </Sider>
  );
};

export default Sidebar;
