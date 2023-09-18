import React from "react";
import { Breadcrumb, theme } from "antd";

const Items: React.FC = () => {
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
          {
            title: <a href="/items">Items</a>,
          },
        ]}
      />
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
        }}
      >
        This is products page.
      </div>
    </>
  );
};

export default Items;
