import React, { useEffect, useState } from "react";
import { Breadcrumb, Alert } from "antd";
import { getProducts } from "../api";
import { Loading, ProductDisplay } from ".";
import { IProduct } from "@src/types";

const Items: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data.products);
      })
      .catch((error: any) => {
        setError(error?.response?.data?.message);
      })
      .finally(() => {
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
        {loading && !error && (
          <Loading description="Please wait while we load the products." />
        )}

        {!loading && error && (
          <Alert message="Error" description={error} type="error" showIcon />
        )}

        {!loading && !error && (
          <ProductDisplay products={products} loading={loading} />
        )}
      </div>
    </>
  );
};

export default Items;
