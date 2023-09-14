import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

export const getParcels = async () => {
  try {
    const response = await api.get("/parcels", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      params: {
        // TODO: Make these params dynamic
        warehouse_id: "650041c789d9fbf5b33516ca",
        product_id: "6502fd92257fee7e80cae38a",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
