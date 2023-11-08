import React, { useState, useEffect } from "react";
import { Table, InputNumber, Button, Input, message, Breadcrumb } from "antd";
import { getProducts, OutletOrder, Product } from "../../api";
import { useNavigate } from "react-router-dom";
import { IProduct } from "@src/types";

const { TextArea, Search } = Input;

const NewOrderPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productData, setProductData] = useState<{
    [key: string]: number | null;
  }>({});
  const [descriptionText, setDescriptionText] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from your API
    getProducts().then((data) => {
      console.log("Fetch products", data.products);
      setProducts(data.products);
    });
  }, []);

  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescriptionText(e.target.value);
  };

  const handleQuantityChange = (record: IProduct, value: number | null) => {
    setProductData({
      ...productData,
      [record._id]: value,
    });
  };

  const handleSubmit = async () => {
    const orderedProducts = Object.keys(productData).map((productId) => ({
      product: productId,
      quantity: productData[productId],
    }));

    const submittedOrder = {
      description: descriptionText,
      products: orderedProducts,
    };

    setSubmitLoading(true);

    try {
      // Post the order to your Node.js API
      await OutletOrder.createOutletOrder(submittedOrder);
      console.log("Successfully submit order", submittedOrder);
      message.success(
        "Order submitted successfully! Returning to home page..."
      );

      // Delay for 3 seconds before navigating
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error: any) {
      const errorMessage = error.error ?? error.message;
      if (errorMessage) {
        message.error(errorMessage);
      } else {
        message.error("Submit order failed! Please try again");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSearch = (e: any) => {
    const value = e.target.value;
    setLoadingSearch(true);
    Product.searchProducts(value)
      .then((data) => {
        setProducts(data.products);
      })
      .catch((error: any) => {
        message.error(error?.response?.data?.message);
      })
      .finally(() => {
        setLoadingSearch(false);
      });
  };

  const columns = [
    {
      title: "Product Name",
      key: "title",
      render: (record: IProduct) => {
        return record.upc_data?.items[0]?.title || "-";
      },
    },
    {
      title: "Barcode",
      dataIndex: "barcode",
      key: "barcode",
    },
    {
      title: "Quantity",
      key: "quantity",
      render: (record: IProduct) => (
        <InputNumber
          min={0}
          max={record.inventory?.parcel_quantity}
          disabled={submitLoading}
          defaultValue={0}
          onChange={(value) => handleQuantityChange(record, value)}
        />
      ),
    },
  ];

  return (
    <div
      style={{
        padding: 15,
        height: "50%",
      }}
    >
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={[
          {
            title: <a href="/new-order">Create New Order</a>,
          },
        ]}
      />
      <h2>Create New Order</h2>
      <TextArea
        showCount
        maxLength={100}
        disabled={submitLoading}
        style={{ height: 50, marginBottom: 20 }}
        onChange={onDescriptionChange}
        placeholder="Order Description"
      />
      <Search
        style={{ width: 200, marginBottom: 20 }}
        placeholder="Search by barcode or name"
        loading={loadingSearch}
        enterButton
        allowClear
        onChange={handleSearch}
      />
      <Table dataSource={products} columns={columns} rowKey="_id" />
      <Button type="primary" loading={submitLoading} onClick={handleSubmit}>
        Submit Order
      </Button>
    </div>
  );
};

export default NewOrderPage;
