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

  const handleFilterChange = (value: string) => {
    if (value === "A-Z") {
      const sortedProducts = [...products].sort((a, b) =>
        a.upc_data.items[0].title.localeCompare(b.upc_data.items[0].title)
      );
      setProducts(sortedProducts);
    } else if (value === "Z-A") {
      const sortedProducts = [...products].sort((a, b) =>
        b.upc_data.items[0].title.localeCompare(a.upc_data.items[0].title)
      );
      setProducts(sortedProducts);
    }
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
            onChange={handleFilterChange}
          >
            <Option value="A-Z">A-Z</Option>
            <Option value="Z-A">Z-A</Option>
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
