import React, { useEffect, useState } from "react";
import { Breadcrumb, Alert, Select, Input } from "antd";
import { getProducts, Product } from "../api";
import { Loading, ProductDisplay } from ".";
import { IProduct } from "@src/types";

const { Option } = Select;
const { Search } = Input;

const Items: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [loadingSearch, setLoadingSearch] = useState(false);

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

  const handleSearch = (e: any) => {
    const value = e.target.value;
    setLoadingSearch(true);
    Product.searchProducts(value)
      .then((data) => {
        setProducts(data.products);
      })
      .catch((error: any) => {
        setError(error?.response?.data?.message);
      })
      .finally(() => {
        setLoadingSearch(false);
      });
  };

  return (
    <>
      <div className="d-flex flex-row justify-content-between mt-2">
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
        <div>
          <Search
            style={{ width: 200, margin: "16px 24px 0 0" }}
            placeholder="Search by barcode or name"
            loading={loadingSearch}
            enterButton
            allowClear
            onChange={handleSearch}
          />
          <Select
            style={{ width: 200, margin: "16px 0" }}
            placeholder="Filter by Status"
            allowClear
            onChange={(value) => {
              // setFilterStatus(value as string);
            }}
            onClear={() => {
              // setFilterStatus(null);
            }}
          >
            <Option value="pending">Pending</Option>
            <Option value="accepted">Accepted</Option>
            <Option value="processed">Processed</Option>
            <Option value="delivered">Delivered</Option>
            <Option value="rejected">Rejected</Option>
            <Option value="">All</Option>
          </Select>
        </div>
      </div>
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
