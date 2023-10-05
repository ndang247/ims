import React from "react";
import { Alert, Spin } from "antd";
import { ILoadingProps } from "@src/types";

const Loading: React.FC<ILoadingProps> = ({ description }) => {
  return (
    <Spin tip="Loading...">
      {description ? (
        <Alert description={description || "Please wait..."} type="info" />
      ) : (
        <span></span>
      )}
    </Spin>
  );
};

export default Loading;
