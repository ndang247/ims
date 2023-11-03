import React, { useEffect, useState } from "react";
import { Breadcrumb, theme } from "antd";
import { IDashboardData } from "@src/types";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [dashboardData, setDashboardData] = useState<IDashboardData>({
    numberOfProducts: 0,
    totalInventory: 0,
    lowQuantityStocks: 0,
    recentUpdateItem: [],
  });

  useEffect(() => {
    const eventSource = new EventSource(
      `https://ims-be.onrender.com/api/v1/stream/dashboard?token=${localStorage.getItem(
        "token"
      )}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data) {
        console.log("Receive dashboard data", data);
        setDashboardData({
          numberOfProducts: data.totalProducts,
          totalInventory: data.totalInventory,
          lowQuantityStocks: data.lowQuantityStocks,
          recentUpdateItem: data.recentUpdateItem,
        });
      }
      // Update your frontend state here
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };
  }, []);

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
            <div>Number of Products: {dashboardData.numberOfProducts}</div>
            <div>Quantity in Hand: {dashboardData.totalInventory}</div>
          </div>
          <div className="grid-item">Low Quantity Stocks:</div>
        </div>
        <div>Recent Update Item</div>
      </div>
    </>
  );
};

export default Dashboard;
