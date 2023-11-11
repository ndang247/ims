import React, { useEffect, useState } from "react";
import { Button, Spin, message, Select, List, Avatar, Popconfirm } from "antd";
import { IOutletOrder, IPallet, IParcel } from "@src/types";
import { OutletOrder, Pallet, Parcel } from "../api";
import { useParams } from "react-router-dom";

const AssignPallets: React.FC = () => {
  const { orderID } = useParams();
  const [pallets, setPallets] = useState<IPallet[]>([]);
  const [order, setOrder] = useState<IOutletOrder | null>(null);
  const [parcelsByPalletName, setParcelsByPalletName] =
    useState<Record<string, IParcel[]>>();
  const [selectedPallets, setSelectedPallets] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    try {
      setLoading(true);
      await fetchPallets();
      await fetchOutletOrder();
      setLoading(false);
    } catch (err: any) {
      console.log("Failed:", err);
      message.error(err.error);
    }
  }

  const fetchPallets = async () => {
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
  };

  const fetchOutletOrder = async () => {
    try {
      const fetchedOrder = orderID
        ? await OutletOrder.getSingleOutletOrder(orderID)
        : null;
      console.log("Outlet Order:", fetchedOrder);

      setOrder(fetchedOrder);
    } catch (err: any) {
      console.log("Failed:", err);
      message.error(err.error);
    }
  };

  const handleChange = (value: string[]) => {
    setSelectedPallets(value);
  };

  const viewParels = async () => {
    try {
      setLoading(true);
      // First get all the parcels from each selected pallet then create a dictionary of pallet name and parcels
      const parcels: IParcel[] = [];
      for (const palletID of selectedPallets) {
        console.log(palletID);

        const fetchedParcels = await Parcel.getParcelsByPalletID(palletID);
        parcels.push(...fetchedParcels);
      }

      // Create a dictionary of pallet name and parcels
      if (parcels.length > 0) {
        const dict = parcels.reduce((acc, parcel) => {
          if (!acc[parcel.pallet.name]) {
            acc[parcel.pallet.name] = [];
          }
          acc[parcel.pallet.name].push(parcel);
          return acc;
        }, {} as Record<string, IParcel[]>);

        setParcelsByPalletName(dict);
      }
      setLoading(false);
    } catch (err: any) {
      console.log("Failed:", err);
      message.error(err.error);
    }
  };

  const confirm = async (_: React.MouseEvent<HTMLElement> | undefined) => {
    try {
      for (const palletID of selectedPallets) {
        const res = await Pallet.assignOrderToPallet(palletID, orderID ?? "");
        console.log(res);
      }
    } catch (err: any) {
      message.error(err.error);
    }
  };

  return (
    <div>
      <h5 className="mt-2">Select Pallets</h5>

      <Select
        mode="multiple"
        style={{ width: "100%", marginBottom: "1rem" }}
        onChange={handleChange}
        // Show all the pallets that are not assigned to any order or currently assigned to the viewing order
        // But do not leave select option blank
        options={pallets
          .filter((pallet) => !pallet.order || pallet.order._id === orderID)
          .map((pallet) => {
            return {
              label: pallet.name,
              value: pallet._id,
            };
          })}
      />

      <Button className="mb-3" onClick={viewParels} disabled={loading}>
        {loading && <Spin className="me-2" />}
        View Parcels
      </Button>

      <div className="d-flex flex-column border rounded p-2 mb-3">
        <span className="fs-6 fw-bold">
          {loading && !order ? (
            <Spin className="me-2" />
          ) : (
            "Outlet Order " + (order?.user.fullname ?? "")
          )}
        </span>
        {
          <div>
            {loading && !order ? (
              <Spin className="me-2" />
            ) : (
              order?.products.map((product, key) => {
                return (
                  <div
                    className="border p-2 rounded-2 d-flex flex-column mb-2"
                    key={key}
                  >
                    <span style={{ fontSize: "14px" }}>
                      {product.product._id}
                    </span>
                    <span>
                      {product.product.upc_data.items[0].title} - Quantity:{" "}
                      {product.quantity}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        }
      </div>

      {/* {parcelsByPalletName &&
        Object.keys(parcelsByPalletName).map((palletName, key) => {
          return (
            <div
              key={key}
              className="d-flex flex-column border rounded p-2 mb-3"
            >
              <span className="fs-6 fw-bold">{palletName}</span>
              {parcelsByPalletName[palletName].map((parcel, key) => {
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
          );
        })} */}

      {loading && !parcelsByPalletName && <Spin className="me-2" />}

      {parcelsByPalletName &&
        Object.keys(parcelsByPalletName).map((palletName, key) => {
          return (
            <div key={key}>
              <h5 className="mt-2">Parcels in {palletName}</h5>
              <List
                pagination={{ position: "bottom", align: "center" }}
                dataSource={parcelsByPalletName[palletName]}
                renderItem={(item, _) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={`${item.product.upc_data.items[0].images[0]}}`}
                        />
                      }
                      title={<a>{item.product.upc_data.items[0].title}</a>}
                      description={`${item._id} - ${item.product.upc_data.items[0].title} - ${item.status}`}
                    />
                  </List.Item>
                )}
              />
            </div>
          );
        })}

      <Button
        className="my-2 me-2"
        onClick={() => {
          window.location.href = "/outlet";
        }}
        disabled={loading}
      >
        {loading && <Spin className="me-2" />}
        Cancel
      </Button>
      <Popconfirm
        title="Confirm Assignment"
        description={`Assign selected pallets to ${order?.user.fullname}'s order?`}
        onConfirm={(e: React.MouseEvent<HTMLElement> | undefined) => confirm(e)}
        okText="Yes"
        cancelText="No"
        disabled={loading}
      >
        <Button className="my-2 me-2" type="primary" disabled={loading}>
          {loading && <Spin className="me-2" />}
          Save
        </Button>
      </Popconfirm>
    </div>
  );
};

export default AssignPallets;
