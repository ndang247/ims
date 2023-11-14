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
  Switch,
} from "antd";
import { OutletOrder, Pallet } from "../api";
import { IOutletOrder, IPallet, IProductOrder } from "../types";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

const OutletOrderManagement = () => {
  const [orders, setOrders] = useState<IOutletOrder[]>([]);
  const [assignedPallets, setAssignedPallets] = useState<IPallet[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<IOutletOrder | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const [modalLoading, setModalLoading] = useState(false);
  const [modalPalletsViewWithTotal, setModalPalletsViewWithTotal] =
    useState(true);

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
          "The order will be seen as processed to a pallet and is ready for delivery.";
        break;
      case "out_for_delivery":
        message =
          "The order will be seen as out for delivery and is with the truck driver or delivery person. Inventory will be deducted for each parcel.";
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
      title: "Full Name",
      dataIndex: "user.fullname",
      key: "user",
      render: (_text: string, record: IOutletOrder) => {
        return `${record.user.fullname ?? "N/A"}`;
      },
    },
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
      render: (text: string) => {
        let color = "";
        switch (text) {
          case "pending":
            color = "blue";
            text = "Pending";
            break;
          case "accepted":
            color = "darkblue";
            text = "Accepted & Processing";
            break;
          case "processed":
            color = "purple";
            text = "Processed";
            break;
          case "out_for_delivery":
            color = "orange";
            text = "Out For Delivery";
            break;
          case "delivered":
            color = "green";
            text = "Delivered";
            break;
          case "rejected":
            color = "red";
            text = "Rejected";
            break;
          default:
            color = "black";
        }
        return <span style={{ color: color, fontWeight: "bold" }}>{text}</span>;
      },
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
    {
      title: "Action",
      key: "actions",
      render: (_: any, record: any) => (
        <Button
          onClick={() =>
            (window.location.href = `/outlet/order/${record._id}/attach-pallets`)
          }
        >
          Attach Pallets
        </Button>
      ),
    },
  ];

  const isOrderSelected = useMemo(() => {
    return !!selectedOrder?._id;
  }, [selectedOrder]);

  const showModal = async (record: IOutletOrder) => {
    try {
      setSelectedOrder(record);
      console.log("Show Modal - Order", record);
      setIsModalVisible(true);
      form.setFieldsValue(record);

      const pallets = await Pallet.getPallets(record._id as string);
      console.log("Pallets", pallets);
      setAssignedPallets(pallets);
    } catch (err: any) {
      console.log(err);
      message.error(err.message);
    }
  };

  const onAssignedPalletsViewSwitch = (checked: boolean) => {
    setModalPalletsViewWithTotal(checked);
  };

  const handleOk = async () => {
    try {
      setModalLoading(true);
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

      await closeViewModal();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleSetOrderForDelivery = async () => {
    try {
      setModalLoading(true);
      await OutletOrder.updateToDelivery(selectedOrder?._id as string);
      message.success("Successfully update outlet order to delivery");
      await closeViewModal();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setModalLoading(false);
    }
  };

  const closeViewModal = async () => {
    form.resetFields();
    setStatusMessage("");
    await init();
    setIsModalVisible(false);
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
          <Option value="accepted">Accepted & Processing</Option>
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
        width={1000}
        title={
          isOrderSelected
            ? `Outlet Order from ${selectedOrder?.user.username ?? "N/A"}`
            : "Add Order"
        }
        open={isModalVisible}
        onOk={handleOk}
        okText="Update"
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
            <Select
              onChange={handleStatusChange}
              disabled={selectedOrder?.status === "delivered"}
            >
              <Option value="pending">Pending</Option>
              <Option value="accepted">Accepted & Processing</Option>
              <Option value="processed">Processed</Option>
              {selectedOrder?.status === "out_for_delivery" && (
                <Option value="out_for_delivery">Out For Delivery</Option>
              )}
              {selectedOrder?.status === "out_for_delivery" && (
                <Option value="delivered">Delivered</Option>
              )}
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

          <hr />

          <div className="container mb-2">
            <div className="row">
              <div className="col-6">
                {/* Orders */}
                <div>
                  <span className="fs-6">Orders</span>
                  {selectedOrder?.products.map((product, key) => {
                    return (
                      <div key={key} className="border rounded-1 p-1 m-2">
                        {product.product.upc_data.items[0].title} - Quantity:{" "}
                        {product.quantity}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="col-6">
                {/* Pallets */}
                {assignedPallets?.length > 0 && (
                  <div>
                    <span className="fs-6">
                      Assigned Pallets
                      <Switch
                        className="ms-2"
                        size="small"
                        defaultChecked
                        checkedChildren="Total"
                        onChange={onAssignedPalletsViewSwitch}
                      />
                    </span>
                    {modalPalletsViewWithTotal
                      ? assignedPallets?.map((pallet, palletKey) => {
                          const productTally = pallet.parcels.reduce<{
                            [key: string]: number;
                          }>((acc, parcel) => {
                            const productName =
                              parcel.product.upc_data.items[0].title;
                            acc[productName] = (acc[productName] || 0) + 1;
                            return acc;
                          }, {});

                          const productList = Object.entries(productTally).map(
                            ([productName, quantity], productKey) => {
                              return (
                                <div
                                  key={productKey}
                                  className="border rounded-1 p-1 m-2"
                                >
                                  {productName} - Quantity: {quantity}
                                </div>
                              );
                            }
                          );

                          return (
                            <div key={palletKey}>
                              <span>{pallet.name}</span>
                              {productList}
                              <hr />
                            </div>
                          );
                        })
                      : assignedPallets?.map((pallet, palletKey) => {
                          return (
                            <div key={palletKey}>
                              <span>{pallet.name}</span>
                              {pallet.parcels.map((parcel, parcelKey) => {
                                return (
                                  <div
                                    className="border rounded-1 p-1 m-2"
                                    key={parcelKey}
                                  >
                                    {parcel.product.upc_data.items[0].title}
                                  </div>
                                );
                              })}
                              <hr />
                            </div>
                          );
                        })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            type="primary"
            loading={modalLoading}
            disabled={
              selectedOrder?.status === "out_for_delivery" ||
              selectedOrder?.status === "delivered" ||
              assignedPallets.length === 0
            }
            onClick={handleSetOrderForDelivery}
          >
            Confirm Pallet and Submit Pallet for Delivery
          </Button>
          {assignedPallets.length === 0 && (
            <Tooltip
              title="Please attach pallets to the order before submitting for delivery."
              placement="bottom"
            >
              <InfoCircleOutlined style={{ marginLeft: "8px" }} />
            </Tooltip>
          )}
          <br />
          <span style={{ color: "grey", fontStyle: "italic" }}>
            This will also set the status of all parcels with attached pallets
            to Out For Delivery, including the current outlet order.
          </span>
          <hr />
        </Form>
      </Modal>
    </>
  );
};

export default OutletOrderManagement;
