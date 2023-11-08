import React, { useState, useEffect } from "react";
import { Button, Input, Breadcrumb, Tooltip, Spin, message } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { postInboundBarcode, getCurrentInbound, clearInboundBarcode } from "../api";
import { ICurrentBarcodeData, IInventory } from "@src/types";
import { Loading } from ".";

const InboundPage: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [errorText, setErrorText] = useState("");
  const [currentBarcode, setCurrentBarcode] = useState("");
  const [currentBarcodeData, setCurrentBarcodeData] =
    useState<ICurrentBarcodeData>();

  const [currentInventory, setCurrentInventory] = useState<IInventory>();
  const [lastFetched, setLastFetched] = useState<Date>();

  const [loading, setLoading] = useState(false);
  const [inboundLoading, setInboundLoading] = useState(false);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(
      `https://ims-be.onrender.com/api/v1/stream/inventory/${currentBarcode}?token=${localStorage.getItem(
        "token"
      )}`
    );

    if (!currentBarcode) {
      eventSource.close();
      return;
    }
    
    setInboundLoading(true)
    eventSource.onmessage = (event) => {
      let data = JSON.parse(event.data);
      if (data) {
        console.log("Receive inventory data", data);
        const datetimeupdated = new Date(data.datetimeupdated).toLocaleString();
        data = { ...data, datetimeupdated };
        setCurrentInventory(data);
        setLastFetched(new Date());
      }
      setInboundLoading(false)
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
      setInboundLoading(false)
    };
  }, [currentBarcode]);

  async function init() {
    try {
      const response = await getCurrentInbound();
      if (response.data && response.data.barcode_input) {
        setCurrentBarcode(response.data.barcode_input);
        setCurrentBarcodeData(response.data.upc_data.items[0]);
      } else {
        setCurrentBarcode("No barcode found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = async () => {
    try {
      setLoading(true);
      setErrorText("");
      if (inputValue.toLocaleLowerCase().trim() === "") {
        message.error("Please enter a barcode");
        return;
      }
      console.log(inputValue);
      await postInboundBarcode(inputValue);

      const response = await getCurrentInbound();
      console.log("Get reponse input after:", response);
      if (response.data && response.data.barcode_input) {
        console.log("Set input");
        setCurrentBarcode(response.data.barcode_input);
        setCurrentBarcodeData(response.data.upc_data.items[0]);
        setLastFetched(new Date());
      }

      setInputValue("");
    } catch (error: any) {
      if (error?.response?.data?.error) {
        setErrorText(error?.response?.data?.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearButtonClick = async () => {
    setCurrentBarcode("")
    setCurrentBarcodeData(undefined)
    setErrorText("")
    setCurrentInventory(undefined)

    try {
      setLoading(true);
      await clearInboundBarcode();
    } catch (error: any) {
      if (error?.response?.data?.error) {
        setErrorText(error?.response?.data?.error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={[
          {
            title: <a href="/">Dashboard</a>,
          },
          {
            title: <a href="/inbound">Inbound</a>,
          },
        ]}
      />
      <div className="d-flex flex-column border rounded p-2">
        <span className="fs-6 fw-bold">
          Current Barcode
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
          Incoming parcels with tag will be registered under this barcode
        </span>
        <span>{currentBarcode}</span>
        <span>{currentBarcodeData?.title ?? ""}</span>
        {inboundLoading ? <Spin /> : <span>Inventory: {currentInventory?.parcel_quantity}</span>}
        
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            flexDirection: "column",
            color: "gray",
            fontSize: "12px",
          }}
        >
          <span>Last Updated: {currentInventory?.datetimeupdated}</span>
          <span>Last Fetched: {lastFetched?.toLocaleString()} </span>
        </div>
      </div>
      <h5 className="mt-2">
        Barcode Inbound Registeration
        <Tooltip
          title="As a pallet of one product going through, after attaching NFC tag to each parcel, 
        scanning parcel to the system with the tag is important. Set the value below to a product barcode for the next incoming parcels."
          placement="bottom"
        >
          <InfoCircleOutlined style={{ marginLeft: "8px" }} />
        </Tooltip>
      </h5>
      <span style={{ color: "grey" }}></span>
      <Input
        className="my-2"
        placeholder="Entering barcode for incoming pallets"
        value={inputValue}
        onChange={handleInputChange}
      />

      {errorText !== "" && (
        <div className="alert alert-danger my-2" role="alert">
          {errorText}
        </div>
      )}

      <Button
        className="my-2 me-2"
        type="primary"
        onClick={handleButtonClick}
        disabled={loading}
      >
        {loading && <Spin className="me-2" />}
        Update Inbound Barcode
      </Button>
      <Button
        className="my-2 text-bg-warning"
        type="primary"
        onClick={handleClearButtonClick}
        disabled={loading}
      >
        Clear
      </Button>

    </div>
  );
};

export default InboundPage;
