import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Row, Alert, Space, Spin } from "antd";
const { Meta } = Card;

import { getProducts } from "../api";
import { IProduct } from "@src/types";

const Items: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data.products);
      setLoading(false);
    });
  }, []);

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
          margin: "1em",
          backgroundColor: "#e3e4e8",
          borderRadius: "5px",
        }}
      >
        {loading ? (
          <div className="loading">
            <Spin tip="Loading..." />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {products.map((product: IProduct, key: number) => {
              return (
                <Col span={6} key={key}>
                  <Card
                    loading={loading}
                    hoverable
                    cover={
                      <img
                        alt={product.upc_data.items[0].title}
                        src={product.upc_data.items[0].images[0]}
                      />
                    }
                    bordered={false}
                  >
                    <Meta
                      title={product.upc_data.items[0].title}
                      description={product.upc_data.items[0].brand}
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </div>
    </>
  );
};

export default Items;
