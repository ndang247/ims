import React from "react";
import type { MenuProps, TabsProps } from "antd";

export type MenuItem = Required<MenuProps>["items"][number];
export type TabItem = Required<TabsProps>["items"][number];

export function getMenuItem(
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

export function getTabItem(
  key: React.Key,
  label: React.ReactNode,
  children?: React.ReactNode
): TabItem {
  return {
    label,
    key,
    children,
  } as TabItem;
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
// Inventory
export interface IInventory {
  _id: string;
  product: string;
  parcel_quantity: number;
  datetimecreated: string;
  datetimeupdated: string;
}

// Loading
export interface ILoadingProps {
  description?: string;
}
//

// Login
export interface ILogin {
  username: string;
  password: string;
}
//

// Sign Up
export interface ISignUp {
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
  warehouse: string;
}
//

// Warehouse
export interface IWarehouse {
  _id: string;
  name: string;
  address: string;
}
//
