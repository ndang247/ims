import React from "react";
import type { MenuProps } from "antd";

export type MenuItem = Required<MenuProps>["items"][number];

export function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    label,
    key,
    icon,
    children,
  } as MenuItem;
}

// Parcels
export interface IParcel {
  _id: string;
  warehouse: {
    _id: string;
    name: string;
  };
}
export interface IParcelProps {
  displayBreadcrumb?: boolean;
}
//

export interface ICurrentBarcodeData {
  title: string;
}

// Products
export interface IProduct {
  _id: string;
  barcode: string;
  upc_data: {
    items: [
      {
        title: string;
        brand: string;
        // images is an array of strings
        images: string[];
      }
    ];
  };
  datetimecreated: Date;
  datetimeupdated: Date;
}
export interface IProductDisplayProps {
  loading: boolean;
  products: IProduct[];
}
//

// Loading
export interface ILoadingProps {
  description?: string;
}
//
