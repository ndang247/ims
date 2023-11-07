import React, { useEffect, useState } from "react";
import { Breadcrumb, theme, Typography, Statistic, Popover } from "antd";
import {
  DatabaseOutlined,
  ExclamationCircleOutlined,
  BorderOutlined
} from '@ant-design/icons';
import { OutletOrder } from "../../api";
import { IDashboardData,  IOutletOrder } from "@src/types";
import "./Dashboard.css";

import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const  { Title } = Typography

const Dashboard: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [dashboardData, setDashboardData] = useState<IDashboardData>({
    numberOfProducts: 0,
    totalInventory: 0,
    lowQuantityStocks: 0,
    recentUpdateItem: [],
    lowInventories: [],
    lastUpdatedInventories: [],
  });

  const [orders, setOrders] = useState<IOutletOrder[]>([]);

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
          lowInventories: data.lowInventories,
          lastUpdatedInventories: data.lastUpdatedInventories,
        });
      }
      // Update your frontend state here
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };

    init()
  }, []);

  const init = async () => {
    try {
      const fetchedOrders = await OutletOrder.getManyOutletOrders();
      // For each order append the key property to the order i.e. key: 1 for the first order then so on
      const ordersWithKey = fetchedOrders.map((order, key) => {
        return { ...order, key };
      }).filter((order) => {
        return order.status === "pending";
      });

      console.log('ordersWithKey', ordersWithKey);

      setOrders(ordersWithKey);
      console.log(orders);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
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
        <div className="row">
          <div className="col-6 p-2">
            <div className="grid-item">
                <Statistic title="Total Products" value={dashboardData.numberOfProducts} prefix={<BorderOutlined />} />
                <Statistic title="Quantity in Hand" value={dashboardData.totalInventory} prefix={<DatabaseOutlined />}/>
                
                <Statistic title="Low Quantity Stocks" value={dashboardData.lowInventories.length} prefix={<ExclamationCircleOutlined />}/>
              
            </div>
          </div>
          <div className="col-6">
            <div className="p-2" style={{ height: '200px', overflowY: 'auto' }}>
              <div className="d-flex flex-column">
                <Title level={5}>Pending Outlet Orders</Title>
                <div>
                  {orders.map((order) => (
                    <div className="border p-2 rounded-2 d-flex flex-column" key={order._id}>
                      <span style={{color: 'gray', fontSize: '12px', fontStyle: 'italic'}}>
                        {new Date(order.datetimecreated).toLocaleString()}
                      </span>
                      <span >
                        Order for {order.user.fullname}
                      </span>
                      <span style={{color: 'gray', fontSize: '12px'}}>
                        {order.description}
                      </span>
                      <Popover placement="right" content={
                        <div style={{width: '300px'}}>
                          {order.products.map((product) => (
                            <div className="d-flex flex-column" key={product._id}>
                              <span>{product.product.barcode}</span>
                              <span style={{fontSize: '5px'}}>{product.product.upc_data.items[0].title}</span> 
                              <hr />
                            </div>
                          ))}
                        </div>
                      }>
                        <span>
                          {order.products.length} products ordered
                        </span>
                      </Popover>
                      <Popover placement="right" content={
                        <div style={{width: '300px'}}>
                          {order.products.map((product) => (
                            <div className="d-flex flex-column" key={product._id}>
                              <span>{product.product.barcode}</span>
                              <span style={{fontSize: '5px'}}>{product.product.upc_data.items[0].title}</span> 
                              <span style={{width: 'fit-content'}} className="border p-1 rounded-2">{product.quantity} parcels</span>
                              <hr />
                            </div>
                          ))}
                        </div>
                      }>
                        <span>
                          {order.products.reduce((acc, curr) => acc + curr.quantity, 0)} parcels ordered
                        </span>
                      </Popover>
                      
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <LowInventoryBarChart lowInventoryItems={dashboardData.lowInventories} />
        </div>
      </div>
    </div>
  );
};

const LowInventoryBarChart = ({ lowInventoryItems }) => {
  const productNames = lowInventoryItems.slice(0,8).map(item => item.product.barcode);
  const productQuantities = lowInventoryItems.slice(0,8).map(item => item.parcel_quantity);

  useEffect(() => {
    console.log(productNames);
    console.log(productQuantities);
  }, [])

  const data = {
    labels: productNames,
    datasets: [
      {
        label: 'Number of Parcels',
        data: productQuantities,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'x', // Horizontal bar chart
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Low Inventory Items',
      },
    },
  };

  return <Bar data={data} options={options} />;
};


export default Dashboard;
