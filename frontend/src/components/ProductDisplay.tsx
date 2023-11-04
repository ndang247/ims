import React from "react";
import { Card, Col, Row } from "antd";
const { Meta } = Card;
import { IProduct, IProductDisplayProps } from "@src/types";

const ProductDisplay: React.FC<IProductDisplayProps> = ({
  products,
  loading,
}) => {
  return (
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
                  // make image align center
                  style={{
                    objectFit: "cover",
                    height: "auto",
                    width: "auto",
                    margin: "auto",
                  }}
                />
              }
              bordered={false}
              onClick={() => {
                window.location.href = `/items/${product._id}`;
              }}
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
  );
};

export default ProductDisplay;
