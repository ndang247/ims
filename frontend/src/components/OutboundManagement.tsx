import React, { useEffect, useState } from "react";
import {
  Button,
  Breadcrumb,
  Tooltip,
  Spin,
  Table,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { IOutboundStream, IPallet } from "@src/types";
import { BASE_URL, Pallet } from "../api";

const OutboundManagement: React.FC = () => {
  const [pallets, setPallets] = useState<IPallet[]>([]);
  const [selectedPallet, setSelectedPallet] = useState<IPallet | null>(null);
  const [streamOutbound, setStreamOutbound] = useState<IOutboundStream>({
    pallet: undefined,
    parcels: [],
    datetimeupdated: new Date().toLocaleString(),
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [loading, setLoading] = useState(false);
  const [outboundLoading, setOutboundLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState<Date>();

  const [isStarted, setIsStarted] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    init();
  }, [selectedPallet, outboundLoading]);

  useEffect(() => {
    outboundStreamInit();
  }, []);

  async function init() {
    try {
      const fetchedPallets = await Pallet.getPallets();
      console.log("Pallets:", fetchedPallets);

      // For each pallet append the key property to the pallet i.e. key: 0 for the first pallet then so on
      const palletsWithKey = fetchedPallets.map((pallet, key) => {
        return { ...pallet, key };
      });

      console.log("Pallets with key:", palletsWithKey);

      setPallets(palletsWithKey);
    } catch (err: any) {
      console.log("Failed:", err);
      message.error(err.error);
    }
  }

  function outboundStreamInit() {
    const eventSource = new EventSource(
      `${BASE_URL}/stream/outbound?token=${localStorage.getItem("token")}`
    );

    setOutboundLoading(true);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Outbound Stream", data);
      if (data) {
        setStreamOutbound({
          pallet: data.pallet ?? undefined,
          parcels: data.parcels ?? [],
          datetimeupdated: new Date().toLocaleString(),
        });
        setLastFetched(new Date());
      }
      setOutboundLoading(false);
    };

    eventSource.onerror = (error) => {
      console.log("EventSource failed", error);
      eventSource.close();
      setOutboundLoading(false);
    };
  }

  const confirm = async (
    _: React.MouseEvent<HTMLElement> | undefined,
    record: IPallet
  ) => {
    try {
      setOutboundLoading(true);
      const res = await Pallet.updatePalletStatus(record._id, "activated");
      setIsStarted(true);
      setSelectedPallet(res.pallet);
      if (streamOutbound.pallet) {
        setOutboundLoading(false);
      }
    } catch (err: any) {
      message.error(err.error);
    }
  };

  const cancel = (_: React.MouseEvent<HTMLElement> | undefined) => {
    setIsStarted(false);
    setSelectedPallet(null);
  };

  const stopOutbound = async (record: IPallet) => {
    try {
      setOutboundLoading(true);
      await Pallet.updatePalletStatus(record._id, "deactivated");
      setIsStarted(false);
      setSelectedPallet(null);
      if (!streamOutbound.pallet) {
        setOutboundLoading(false);
      }
    } catch (err: any) {
      message.error(err.error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string) => {
        let color = "";
        switch (text) {
          case "activated":
            color = "green";
            text = "Activated";
            break;
          case "out_for_delivery":
            color = "blue";
            text = "Out for Delivery";
            break;
          case "deactivated":
            color = "red";
            text = "Deactivated";
            break;
          default:
            color = "black";
        }
        return <span style={{ color: color, fontWeight: "bold" }}>{text}</span>;
      },
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
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (_: any, record: IPallet) => {
        return (
          <>
            {record.status !== "out_for_delivery" &&
              (record.status === "activated" ? (
                <Button
                  style={{
                    backgroundColor: "#fd1d32",
                    borderColor: "#fd1d32",
                    color: "white",
                  }}
                  onClick={() => stopOutbound(record)}
                >
                  STOP
                </Button>
              ) : (
                <Popconfirm
                  title="Start outbound with this pallet?"
                  description="Are you sure to start loading parcels onto this pallet?"
                  onConfirm={(e: React.MouseEvent<HTMLElement> | undefined) =>
                    confirm(e, record)
                  }
                  onCancel={(e: React.MouseEvent<HTMLElement> | undefined) =>
                    cancel(e)
                  }
                  okText="Yes"
                  cancelText="No"
                  disabled={isStarted}
                >
                  <Button
                    style={{
                      backgroundColor: `${
                        selectedPallet && record._id !== selectedPallet?._id
                          ? "#dddddd"
                          : "rgb(103 233 40)"
                      }`,
                      borderColor: `${
                        selectedPallet && record._id !== selectedPallet?._id
                          ? "#dddddd"
                          : "rgb(103 233 40)"
                      }`,
                      color: "white",
                    }}
                    disabled={
                      Object.keys(selectedPallet ?? {}).length !== 0 &&
                      record._id !== selectedPallet?._id
                    }
                  >
                    START
                  </Button>
                </Popconfirm>
              ))}
          </>
        );
      },
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      let values: IPallet = await form.validateFields();
      values = {
        ...values,
        capacity: 20,
      };

      console.log("Values:", values);
      const res = await Pallet.createPallet(values);
      console.log("Pallet:", res);

      form.resetFields();
      setIsModalVisible(false);
      setLoading(true);

      setTimeout(() => {
        if (res.pallet) {
          message.success(`Pallet ${res.pallet.name} created successfully`);
        }
        setLoading(false);
      }, 3000);
    } catch (err: any) {
      console.log("Failed:", err);
      setErrorText(err.error);
    }
  };

  return (
    <div>
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={[
          {
            title: <a href="/">Dashboard</a>,
          },
          {
            title: <a href="/outbound">Outbound</a>,
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
        {streamOutbound.pallet ? (
          <>
            <span>ID: {streamOutbound.pallet._id}</span>
            <span>Name: {streamOutbound.pallet.name}</span>
            {outboundLoading ? (
              <Spin />
            ) : (
              <span>Capacity: {streamOutbound.pallet.capacity}</span>
            )}
          </>
        ) : (
          <>
            <span>No activated pallet</span>
            {outboundLoading && <Spin />}
          </>
        )}

        {streamOutbound.pallet && (
          <div>
            <span>
              {streamOutbound.parcels.length} parcels in pallet{" "}
              {streamOutbound.pallet.name}
            </span>
            {streamOutbound.parcels.map((parcel, key) => {
              return (
                <div
                  className="border p-2 rounded-2 d-flex flex-column mb-2"
                  key={key}
                >
                  <span style={{ fontSize: "14px" }}>
                    {parcel.product.barcode}
                  </span>
                  <span>{parcel.product.upc_data.items[0].title}</span>
                </div>
              );
            })}
          </div>
        )}
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
          <span>Last Fetched: {lastFetched?.toLocaleString()}</span>
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

      <Button
        className="my-2 me-2"
        type="primary"
        onClick={showModal}
        disabled={loading || isStarted}
      >
        {loading && <Spin className="me-2" />}
        Create a Pallet
      </Button>

      <Modal
        title={"Set Pallet Name"}
        open={isModalVisible}
        okText="Submit"
        onOk={handleSubmit}
        onCancel={() => {
          form.resetFields();
          setIsModalVisible(false);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Pallet Name" name="name" required>
            <Input />
          </Form.Item>
        </Form>
        {errorText !== "" && (
          <div className="alert alert-danger my-2" role="alert">
            {errorText}
          </div>
        )}
      </Modal>

      <Table
        dataSource={pallets}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <>
                {record.parcels.length > 0 &&
                  record.parcels.map((parcel) => {
                    return (
                      <div
                        className="border p-2 rounded-2 d-flex flex-column mb-2"
                        key={parcel._id}
                      >
                        <span style={{ fontSize: "14px" }}>
                          {parcel._id} --- {parcel.product.barcode} ---{" "}
                          {parcel.product.upc_data.items[0].title} ---{" "}
                          {parcel.status}
                        </span>
                      </div>
                    );
                  })}
              </>
            );
          },
          rowExpandable: (record) => record.parcels.length > 0,
        }}
      />
    </div>
  );
};

export default OutboundManagement;
