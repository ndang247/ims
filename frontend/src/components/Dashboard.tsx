import React, { useEffect } from "react";
import { Breadcrumb, theme } from "antd";
import './Dashboard.css'

const Dashboard: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    console.log('Load');
  }, [])

  return (
    <>
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={[
          {
            title: <a href="/">Dashboard</a>,
          },
        ]}
      />
      <div
        style={{
          padding: 15,
          height: "50%",
          background: colorBgContainer,
        }}
      >
        <div className="grid-container">
          <div className="grid-item">
            Inventory Summary
            <div>Number of Products: </div>
            <div>Quantity in Hand: </div>
          </div>
          <div className="grid-item">Low Quantity Stocks:</div>
        </div>
        <div>
          Recent Update Item
        </div>
      </div>
    </>
  );
};

export default Dashboard;
