import React from "react";
import { Breadcrumb, theme } from "antd";
import { Parcels } from ".";

const Dashboard: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

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

      <Parcels displayBreadcrumb={false} />

      <div
        style={{
          padding: 15,
          height: "50%",
          background: colorBgContainer,
        }}
      ></div>
    </>
  );
};

export default Dashboard;
