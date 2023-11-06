import { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tooltip,
  Divider,
  Breadcrumb,
  message,
} from "antd";
import { OutletOrder } from "../api";
import { IOutletOrder, IProductOrder } from "../types";

const { Option } = Select;

const OutletOrderManagement = () => {
  const [orders, setOrders] = useState<IOutletOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<IOutletOrder | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const handleStatusChange = (value: string) => {
    let message = "";
    switch (value) {
      case "pending":
        message = "The order will be pending approval.";
        break;
      case "accepted":
        message = "The order will be accepted and headed to processing.";
        break;
      case "processed":
        message =
          "The order will be seen as processed and is ready for delivery.";
        break;
      case "out_for_delivery":
        message =
          "The order will be seen as out for delivery and is with the truck driver or delivery person.";
        break;
      case "delivered":
        message =
          "The order will be seen as delivered successfully to the dedicated outlet.";
        break;
      case "rejected":
        message = "The order will be rejected.";
        break;
      default:
        message = "";
    }
    setStatusMessage(message);
  };

  const [form] = Form.useForm();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const fetchedOrders = await OutletOrder.getManyOutletOrders();
      // For each order append the key property to the order i.e. key: 1 for the first order then so on
      const ordersWithKey = fetchedOrders.map((order, key) => {
        return { ...order, key };
      });

      setOrders(ordersWithKey);
      console.log(orders);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "User",
      dataIndex: "user.username",
      key: "user",
      render: (_text: string, record: IOutletOrder) => {
        return `${record.user.username ?? "N/A"} - ${record.user.role}`;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "No. Products",
      dataIndex: "products.length",
      key: "productsNo",
      render: (_text: string, record: IOutletOrder) => {
        const tooltipContent = record.products
          .map(
            (prod: IProductOrder) => `${prod.product.barcode}: ${prod.quantity}`
          )
          .join(", ");

        return (
          <Tooltip title={tooltipContent}>
            {record.products.length ?? 0}
          </Tooltip>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Date Created",
      dataIndex: "datetimecreated",
      key: "datetimecreated",
      render: (text: Date) => {
        const date = new Date(text);
        return `${date.toLocaleString()}`;
      },
    },
    {
      title: "Date Updated",
      dataIndex: "datetimeupdated",
      key: "datetimeupdated",
      render: (text: Date) => {
        const date = new Date(text);
        return `${date.toLocaleString()}`;
      },
    },
    {
      title: "View",
      key: "view",
      render: (_: any, record: any) => (
        <Button onClick={() => showModal(record)}>View</Button>
      ),
    },
  ];

  const isOrderSelected = useMemo(() => {
    return !!selectedOrder?._id;
  }, [selectedOrder]);

  const showModal = (record: any) => {
    setSelectedOrder(record);
    console.log("Show Modal - Order", record);
    setIsModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleOk = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue() as IOutletOrder;
      console.log("Handle ok, values", values);

      if (isOrderSelected) {
        await OutletOrder.updateOutletOrder(
          selectedOrder?._id as string,
          values
        );
      } else {
        await OutletOrder.createOutletOrder(values);
      }

      form.resetFields();
      setStatusMessage("");
      await init();
      setIsModalVisible(false);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <>
      <div className="d-flex flex-row justify-content-between align-items-center mt-2">
        <Breadcrumb
          style={{ margin: "16px 0" }}
          items={[
            {
              title: <a href="/">Dashboard</a>,
            },
            {
              title: <a href="/outlet">Outlet Order Management</a>,
            },
          ]}
        />
        <Select
          style={{ width: 200, margin: "16px 0" }}
          placeholder="Filter by Status"
          allowClear
          onChange={(value) => {
            setFilterStatus(value as string);
          }}
          onClear={() => {
            setFilterStatus(null);
          }}
        >
          <Option value="pending">Pending</Option>
          <Option value="accepted">Accepted</Option>
          <Option value="processed">Processed</Option>
          <Option value="out_for_delivery">Out For Delivery</Option>
          <Option value="delivered">Delivered</Option>
          <Option value="rejected">Rejected</Option>
          <Option value="">All</Option>
        </Select>
      </div>
      <Table
        dataSource={
          filterStatus
            ? orders.filter((order) => order.status === filterStatus)
            : orders
        }
        columns={columns}
      />
      <Modal
        title={
          isOrderSelected
            ? `Outlet Order from ${selectedOrder?.user.username ?? "N/A"}`
            : "Add Order"
        }
        open={isModalVisible}
        onOk={handleOk}
        okText="Submit"
        onCancel={() => {
          form.resetFields();
          setStatusMessage("");
          setIsModalVisible(false);
        }}
      >
        <Divider />
        <Form form={form} layout="vertical">
          {/* Description */}
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          {/* Status */}
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select the status!" }]}
          >
            <Select onChange={handleStatusChange}>
              <Option value="pending">Pending</Option>
              <Option value="accepted">Accepted & Processing</Option>
              <Option value="processed">Processed</Option>
              <Option value="out_for_delivery">Out For Delivery</Option>
              <Option value="delivered">Delivered</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </Form.Item>
          {statusMessage && (
            <span className="text-secondary py-2">{statusMessage}</span>
          )}

          {/* Comment */}
          <Form.Item label="Comment" name="comment">
            <Input.TextArea />
          </Form.Item>

          {/* Products */}
          <div>
            <span className="fs-6">Products</span>
            {selectedOrder?.products.map((product, key) => {
              return (
                <div key={key} className="border rounded-1 p-1 m-2">
                  {product.product.upc_data.items[0].title} - Quantity:{" "}
                  {product.quantity}
                </div>
              );
            })}
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default OutletOrderManagement;
