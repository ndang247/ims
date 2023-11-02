import React, { useState, useEffect } from "react";
import { Table, InputNumber, Button, Input, message } from "antd";
import { getProducts, OutletOrder } from "../../api";
import { useNavigate } from "react-router-dom";
import { IProduct } from "@src/types";

const { TextArea } = Input;

const NewOrderPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productData, setProductData] = useState<{
    [key: string]: number | null;
  }>({});
  const [descriptionText, setDescriptionText] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

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

  const columns = [
    {
      title: "Product Name",
      dataIndex: "upc_data.items[0].title",
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
          max={record.inventory?.parcel_quantity || 1}
          disabled={submitLoading}
          defaultValue={0}
          onChange={(value) => handleQuantityChange(record, value)}
        />
      ),
    },
  ];

  return (
    <div>
      <h2>Create New Order</h2>
      <TextArea
        showCount
        maxLength={100}
        disabled={submitLoading}
        style={{ height: 50, marginBottom: 24 }}
        onChange={onDescriptionChange}
        placeholder="Order Description"
      />
      <Table dataSource={products} columns={columns} rowKey="_id" />
      <Button type="primary" loading={submitLoading} onClick={handleSubmit}>
        Submit Order
      </Button>
    </div>
  );
};

export default NewOrderPage;
