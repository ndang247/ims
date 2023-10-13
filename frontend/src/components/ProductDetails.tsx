import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb, message, Tabs } from "antd";
import type { TabsProps } from "antd";
import { getProductByID } from "../api";
import { IProduct, getTabItem } from "../types";

const items: TabsProps["items"] = [
  getTabItem(
    "1",
    "Overview",
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ flex: "70%" }}>
        <div>
          <table>
            <tr>
              <th colSpan={3}>Primary Details</th>
            </tr>
            <tr>
              <td>Name</td>
              {/* <td></td> */}
              <td>name</td>
            </tr>
            <tr>
              <td>ID</td>
              {/* <td></td> */}
              <td>id</td>
            </tr>
            <tr>
              <td>Category</td>
              {/* <td></td> */}
              <td>category</td>
            </tr>
            <tr>
              <td>Expiry Date</td>
              {/* <td></td> */}
              <td>date</td>
            </tr>
          </table>
        </div>

        <br />
        <div>
          <table>
            <tr>
              <th colSpan={3}>Supplier Details</th>
            </tr>
            <tr>
              <td>Name</td>
              {/* <td></td> */}
              <td>name</td>
            </tr>
            <tr>
              <td>Number</td>
              {/* <td></td> */}
              <td>number</td>
            </tr>
            <tr>
              <td>ABN</td>
              {/* <td></td> */}
              <td>category</td>
            </tr>
            <tr>
              <td>Joined Date</td>
              {/* <td></td> */}
              <td>date</td>
            </tr>
          </table>
        </div>

        <br />
        <div>
          <h5>Stock Locations</h5>
          <table>
            <tr>
              <th>Store Name</th>
              <th>Stock in hand</th>
            </tr>
            <tr>
              <td>Sulur Branch</td>
              {/* <td></td> */}
              <td>15</td>
            </tr>
            <tr>
              <td>Singa Branch</td>
              {/* <td></td> */}
              <td>19</td>
            </tr>
          </table>
        </div>
      </div>
      <div style={{ flex: "30%" }}>asas</div>
    </div>
  ),
];

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({} as IProduct);

  useEffect(() => {
    fetchProductByID();
  }, []);

  const fetchProductByID = async () => {
    try {
      if (!id) {
        throw new Error("No product ID provided");
      }
      const res = await getProductByID(id);
      setProduct(res.product);
    } catch (error) {
      message.error("Failed to get product. Please try again!");
    }
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
        {Object.keys(product).length > 0 && (
          <div>
            <h4>{product.upc_data.items[0].title}</h4>
          </div>
        )}
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </>
  );
};

export default ProductDetails;
