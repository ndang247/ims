import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb, message, Tabs } from "antd";
import { getParcels, getProductByID } from "../api";
import {
  IGroupedParcels,
  IParcel,
  IProduct,
  IInventory,
  getTabItem,
} from "../types";
import { Loading } from ".";

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({} as IProduct);
  const [groupedParcels, setGroupedParcels] = useState({} as IGroupedParcels);
  const [loading, setLoading] = useState(true);
  const [currentInventory, setCurrentInventory] = useState<IInventory>();
  const [lastFetched, setLastFetched] = useState<Date>();

  useEffect(() => {
    fetchProductByID();
    fetchParcels();
  }, []);

  useEffect(() => {
    if (!product.barcode) {
      return;
    }
    const eventSource = new EventSource(
      `http://localhost:8080/api/v1/stream/inventory/${
        product.barcode
      }?token=${localStorage.getItem("token")}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data) {
        console.log("Receive inventory data", data);
        setCurrentInventory(data);
        setLastFetched(new Date());
      }
      // Update your frontend state here
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };
  }, [product.barcode]);

  const fetchProductByID = async () => {
    try {
      if (!id) {
        throw new Error("No product ID provided");
      }
      const res = await getProductByID(id);

      // Format the date component as "dd/mm/yyyy"
      const datetimecreated = new Date(res.product.datetimecreated);
      const formattedDate = `${datetimecreated
        .getDate()
        .toString()
        .padStart(2, "0")}/${(datetimecreated.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${datetimecreated.getFullYear()}`;

      // Format the time component as "hh:mm:ss AM/PM"
      const hours = datetimecreated.getHours() % 12 || 12; // Convert to 12-hour format
      const amPm = datetimecreated.getHours() < 12 ? "AM" : "PM";
      const formattedTime = `${hours
        .toString()
        .padStart(2, "0")}:${datetimecreated
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${datetimecreated
        .getSeconds()
        .toString()
        .padStart(2, "0")} ${amPm}`;

      // Combine the formatted date and time components
      const formattedDateTime = `${formattedDate}, ${formattedTime}`;

      setProduct({
        ...res.product,
        datetimecreated: formattedDateTime,
      });
    } catch (error) {
      message.error("Failed to get product. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const fetchParcels = async () => {
    try {
      if (!id) {
        throw new Error("No product ID provided");
      }
      const res = await getParcels(id);
      setGroupedParcels(groupParcelsByWarehouse(res.parcels));
    } catch (error) {
      message.error("Failed to get parcels. Please try again!");
    }
  };

  const groupParcelsByWarehouse = (parcels: IParcel[]) => {
    const groupedParcels = parcels.reduce((acc, parcel) => {
      const key = parcel.warehouse.name;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(parcel);
      return acc;
    }, {} as IGroupedParcels);

    return groupedParcels;
  };

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <>
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={[
          {
            title: <a href="/">Dashboard</a>,
          },
          {
            title: <a href="/items">Items</a>,
          },
          {
            title: <a href={`/items/${id}`}>{product.barcode}</a>,
          },
        ]}
      />
      <div
        style={{
          padding: 24,
          backgroundColor: "#fff",
          borderRadius: "0.5rem",
        }}
      >
        {Object.keys(product).length === 0 &&
          Object.keys(groupedParcels).length === 0 &&
          loading && (
            <Loading description="Please wait while we load the products." />
          )}

        {Object.keys(product).length > 0 &&
          Object.keys(groupedParcels).length > 0 &&
          !loading && (
            <div>
              <h4>{product.upc_data.items[0].title}</h4>
            </div>
          )}

        {Object.keys(product).length > 0 &&
          Object.keys(groupedParcels).length > 0 &&
          !loading && (
            <Tabs
              defaultActiveKey="1"
              items={[
                getTabItem(
                  "1",
                  "Overview",
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div style={{ flex: "70%" }}>
                      <div>
                        <table>
                          <thead>
                            <tr>
                              <th colSpan={3}>Primary Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Name</td>
                              {/* <td></td> */}
                              <td>{product?.upc_data?.items[0]?.title}</td>
                            </tr>
                            <tr>
                              <td>ID</td>
                              {/* <td></td> */}
                              <td>{product?._id}</td>
                            </tr>
                            <tr>
                              <td>Category</td>
                              {/* <td></td> */}
                              <td>{product?.upc_data?.items[0]?.category}</td>
                            </tr>
                            <tr>
                              <td>EAN</td>
                              {/* <td></td> */}
                              <td>{product?.barcode}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <br />
                      <div>
                        <table>
                          <thead>
                            <tr>
                              <th colSpan={3}>Supplier Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Name</td>
                              {/* <td></td> */}
                              <td>{product?.upc_data?.items[0]?.brand}</td>
                            </tr>
                            <tr>
                              <td>Number</td>
                              {/* <td></td> */}
                              <td>98789 86757</td>
                            </tr>
                            <tr>
                              <td>ABN</td>
                              {/* <td></td> */}
                              <td>98789 86757</td>
                            </tr>
                            <tr>
                              <td>Joined Date</td>
                              {/* <td></td> */}
                              <td>{product?.datetimecreated.toString()}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <br />
                      <div>
                        <h5>Stock Locations</h5>
                        <table>
                          <thead>
                            <tr>
                              <th>Warehouse(s)</th>
                              <th>Stock/Parcels</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(groupedParcels).map((key) => (
                              <tr key={key}>
                                <td>{key}</td>
                                <td>{groupedParcels[key].length}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div
                      style={{
                        flex: "30%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          textAlign: "center",
                          background: `url(${product?.upc_data?.items[0]?.images[0]}) lightgray 50% / cover no-repeat`,
                          border: "2px dashed #9D9D9D",
                          boxSizing: "border-box",
                          padding: "130px",
                          height: "50%",
                          width: "80%",
                        }}
                      ></div>
                    </div>
                  </div>
                ),
                getTabItem(
                  "2",
                  "Live Inventory",
                  <div className="d-flex flex-column">
                    <span className="fs-2">
                      WH-1
                      <span
                        className="ms-2"
                        style={{
                          border: "1px solid green",
                          borderRadius: "5px",
                          color: "green",
                        }}
                      >
                        Live
                      </span>
                    </span>
                    <span>Inventory: {currentInventory?.parcel_quantity}</span>
                    <span>{lastFetched?.toLocaleString()}</span>
                  </div>
                ),
              ]}
              onChange={onChange}
            />
          )}
      </div>
    </>
  );
};

export default ProductDetails;
