import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

const DEFAULT_WAREHOUSE_ID = "650041c789d9fbf5b33516ca";

export const getParcels = async () => {
  try {
    const response = await api.get("/parcels", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      params: {
        // TODO: Make these params dynamic
        warehouse_id: DEFAULT_WAREHOUSE_ID,
        // product_id: "6502fd92257fee7e80cae38a",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const postInboundBarcode = async (barcode: string) => {
  try {
    const response = await api.post("/inbound/barcode-input", {
      warehouse_id: DEFAULT_WAREHOUSE_ID,
      barcode,
    });
    return response;
  } catch (error) {
    console.log('Error post inbound barcode');
    console.log(error);
    throw error;
  }
}

export const getCurrentInbound = async () => {
  const response = await api.get("/inbound/get", {
    params: {
      warehouse_id: DEFAULT_WAREHOUSE_ID,
    }
  });
  return response.data;
}
