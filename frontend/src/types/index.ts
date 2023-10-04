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

export interface IParcel {
  _id: string;
  warehouse: string;
}

export interface IParcelProps {
  displayBreadcrumb?: boolean;
}

export interface ICurrentBarcodeData {
  title: string;
}
