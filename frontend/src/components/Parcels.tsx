import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import { AgGridReact } from "ag-grid-react"; // The AG Grid React Component
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

import { Breadcrumb, theme } from "antd";

import { getParcels } from "../api";
import { IParcel, IParcelProps } from "../types";

const Parcels: React.FC<IParcelProps> = ({
  displayBreadcrumb = true,
}: IParcelProps) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const gridRef = useRef<AgGridReact>(null); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState<IParcel[]>(); // Set rowData to Array of Objects, one Object per Row

  // Each Column Definition results in one Column.
  const [columnDefs] = useState<ColDef[]>([
    { headerName: "ID", field: "_id", filter: true },
    { headerName: "Warehouse", field: "warehouse", filter: true },
    // { headerName: "Shelf", field: "shelf", filter: true },
    { headerName: "Product", field: "product._id", filter: true },
    { headerName: "Barcode", field: "product.barcode", filter: true },
    { headerName: "UPC", field: "product.upc_data.data", filter: true },
    { headerName: "RFID", field: "rfid.id", filter: true },
    { headerName: "Tag Data", field: "rfid.tag_data", filter: true },
    { headerName: "RFID Status", field: "rfid.status", filter: true },
    { headerName: "Status", field: "status", filter: true },
    { headerName: "Created At", field: "datetimecreated", filter: true },
    { headerName: "Updated At", field: "datetimeupdated", filter: true },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
    };
  }, []);

  // Example of consuming Grid Event
  const cellClickedListener = useCallback((event: object) => {
    console.log("cellClicked", event);
  }, []);

  // Example load data from server
  useEffect(() => {
    getParcels().then((result) => {
      setRowData(result?.data.parcels);
    });
  }, []);

  useEffect(() => {
    if (gridRef.current && rowData) {
      gridRef.current.api.sizeColumnsToFit();
    }
  }, [rowData]);

  // Example using Grid's API
  //   const buttonListener = useCallback((e: object) => {
  //     console.log(e);
  //     gridRef.current?.api.deselectAll();
  //   }, []);

  return (
    <>
      {displayBreadcrumb && (
        <Breadcrumb
          style={{ margin: "16px 0" }}
          items={[
            {
              title: <a href="/">Dashboard</a>,
            },
            {
              title: <a href="/parcels">Parcels</a>,
            },
          ]}
        />
      )}
      <div
        style={{
          padding: 15,
          height: "50%",
          background: colorBgContainer,
        }}
      >
        <div
          style={{ height: "calc(100% - 25px)" }}
          className="ag-theme-alpine"
        >
          {/* Example using Grid's API */}
          {/* <button
            onClick={buttonListener}
            style={{ color: "#fff", marginBottom: "0.5rem" }}
          >
            Push Me
          </button> */}

          {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
          <div style={{ width: "100%", height: "100%" }}>
            <AgGridReact
              ref={gridRef} // Ref for accessing Grid's API
              rowData={rowData} // Row Data for Rows
              columnDefs={columnDefs} // Column Defs for Columns
              defaultColDef={defaultColDef} // Default Column Properties
              animateRows={true} // Optional - set to 'true' to have rows animate when sorted
              rowSelection="multiple" // Options - allows click selection of rows
              onCellClicked={cellClickedListener} // Optional - registering for Grid Event
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Parcels;
