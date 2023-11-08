import { useState, useEffect } from "react";
import { Table, Select, Tooltip, Breadcrumb } from "antd";
import { OutletOrder } from "../../api";
import { IOutletOrder, IProductOrder, IViewOrdersProps } from "../../types";

const { Option } = Select;

const ViewOrders: React.FC<IViewOrdersProps> = ({ outletID }) => {
  const [orders, setOrders] = useState<IOutletOrder[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const fetchedOrders = await OutletOrder.getManyOutletOrdersByOutletID(
        outletID
      );
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
  ];

  const handleFilterChange = (value: string) => {
    let filteredProducts = [...orders];
    switch (value) {
      case "recentlyAdded":
        filteredProducts = filteredProducts.sort((a, b) =>
          new Date(b.datetimecreated)
            .toISOString()
            .localeCompare(new Date(a.datetimecreated).toISOString())
        );
        setOrders(filteredProducts);
        setFilterStatus(null);
        break;
      case "recentlyUpdated":
        filteredProducts = filteredProducts.sort((a, b) =>
          new Date(b.datetimeupdated)
            .toISOString()
            .localeCompare(new Date(a.datetimeupdated).toISOString())
        );
        setOrders(filteredProducts);
        setFilterStatus(null);
        break;
      default:
        setFilterStatus(value as string);
        break;
    }
  };

  return (
    <>
      <div className="d-flex flex-row justify-content-between align-items-center mt-2">
        <Breadcrumb
          style={{ margin: "16px 0" }}
          items={[
            {
              title: <a href="/orders">View Orders</a>,
            },
          ]}
        />
        <Select
          style={{ width: 200, margin: "16px 0" }}
          placeholder="Filter by Status"
          allowClear
          onChange={handleFilterChange}
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
          <Option value="recentlyAdded">Recently Added</Option>
          <Option value="recentlyUpdated">Recently Updated</Option>
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
    </>
  );
};

export default ViewOrders;
