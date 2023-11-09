import React, { useState } from "react";
import {
  Button,
  Breadcrumb,
  Tooltip,
  Spin,
  Table,
  Modal,
  Form,
  Input,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const OutboundManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [loading, setLoading] = useState(false);
  const [outboundLoading, setOutboundLoading] = useState(false);

  const [form] = Form.useForm();

  //   const columns = [
  //     {
  //       title: "ID",
  //     },
  //     {
  //       title: "Name",
  //     },
  //     {
  //       title: "Status",
  //     },
  //     {
  //       title: "Date Created",
  //     },
  //     {
  //       title: "Date Updated",
  //     },
  //     {
  //       title: "Action",
  //       key: "action",
  //       render: () => <Button>START</Button>,
  //     },
  //   ];

  const showModal = (record: any) => {
    setIsModalVisible(true);
  };

  interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
    description: string;
  }

  const columns: ColumnsType<DataType> = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: () => {
        return (
          <>
            <Button
              style={{
                backgroundColor: "rgb(103 233 40)",
                borderColor: "rgb(103 233 40)",
                color: "white",
              }}
            >
              START
            </Button>
            &nbsp;
            <Button
              style={{
                backgroundColor: "#fd1d32",
                borderColor: "#fd1d32",
                color: "white",
              }}
            >
              STOP
            </Button>
          </>
        );
      },
    },
  ];

  const data: DataType[] = [
    {
      key: 1,
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      description:
        "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.",
    },
    {
      key: 2,
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      description:
        "My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.",
    },
    {
      key: 3,
      name: "Not Expandable",
      age: 29,
      address: "Jiangsu No. 1 Lake Park",
      description: "This not expandable",
    },
    {
      key: 4,
      name: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
      description:
        "My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.",
    },
  ];

  return (
    <div>
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={[
          {
            title: <a href="/">Dashboard</a>,
          },
          {
            title: <a href="/outbound-management">Outbound</a>,
          },
        ]}
      />
      <div className="d-flex flex-column border rounded p-2">
        <span className="fs-6 fw-bold">
          Current Active Pallet
          <span
            className="ms-2"
            style={{
              border: "1px solid green",
              borderRadius: "5px",
              color: "green",
              padding: "2px 5px",
            }}
          >
            Live
          </span>
        </span>
        <span className="pb-2" style={{ color: "grey" }}>
          Scanned parcels will be added to this pallet.
        </span>
        <span>pallet_id</span>
        <span>pallet_name</span>
        {outboundLoading ? <Spin /> : <span>Parcel Quantity:</span>}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            flexDirection: "column",
            color: "gray",
            fontSize: "12px",
          }}
        >
          <span>Last Updated:</span>
          <span>Last Fetched:</span>
        </div>
      </div>
      <h5 className="mt-2">
        Outbound Pallet Creation
        <Tooltip
          title="As a pallet is created the initial status is set to deactivated, after click on start, the status will be changed to activated.
        Scanning parcel will be added to the currently activated pallet."
          placement="bottom"
        >
          <InfoCircleOutlined style={{ marginLeft: "8px" }} />
        </Tooltip>
      </h5>
      <span style={{ color: "grey" }}></span>

      {errorText !== "" && (
        <div className="alert alert-danger my-2" role="alert">
          {errorText}
        </div>
      )}

      <Button
        className="my-2 me-2"
        type="primary"
        onClick={showModal}
        disabled={loading}
      >
        {loading && <Spin className="me-2" />}
        Create a Pallet
      </Button>

      <Modal
        title={"Set Pallet Name"}
        open={isModalVisible}
        okText="Submit"
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Pallet Name" name="name" required>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        dataSource={data}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <>
                <p style={{ margin: 0 }}>{record.description}</p>
                <p style={{ margin: 0 }}>{record.description}</p>
              </>
            );
          },
          rowExpandable: (record) => record.name !== "Not Expandable",
        }}
      />
    </div>
  );
};

export default OutboundManagement;
