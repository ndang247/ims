import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

const DEFAULT_WAREHOUSE_ID = "650041c789d9fbf5b33516ca";

export const getParcels = async (productID?: string) => {
  const paramsObj = productID
    ? {
        warehouse_id: DEFAULT_WAREHOUSE_ID,
        product_id: productID,
      }
    : {
        warehouse_id: DEFAULT_WAREHOUSE_ID,
      };
  try {
    const response = await api.get("/parcels", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: localStorage.getItem("token"),
      },
      params: paramsObj,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const postInboundBarcode = async (barcode: string) => {
  try {
    const response = await api.post(
      "/inbound/barcode-input",
      {
        warehouse_id: DEFAULT_WAREHOUSE_ID,
        barcode,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return response;
  } catch (error) {
    console.log("Error post inbound barcode");
    console.log(error);
    throw error;
  }
};

export const getCurrentInbound = async () => {
  const response = await api.get("/inbound/get", {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: localStorage.getItem("token"),
    },
    params: {
      warehouse_id: DEFAULT_WAREHOUSE_ID,
    },
  });
  return response.data;
};

export const getProducts = async () => {
  try {
    const response = await api.get("/products", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: localStorage.getItem("token"),
      },
      params: {
        warehouseID: DEFAULT_WAREHOUSE_ID,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getProductByID = async (productID: string) => {
  try {
    const response = await api.get(`/product/?id=${productID}`, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: localStorage.getItem("token"),
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const postLogin = async (username: string, password: string) => {
  try {
    const response = await api.post("/login", {
      username: username,
      password: password,
    });

    if (response.data && response.data.token) {
      localStorage.setItem("token", response.data.token);
      return response.data.token;
    } else {
      // Handle login failure
      throw new Error("Login failed");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const postSignUp = async (
  username: string,
  password: string,
  role: string,
  warehouses: string[]
) => {
  try {
    const response = await api.post("/signup", {
      username: username,
      password: password,
      role: role,
      warehouses: warehouses,
    });

    if (response.data && response.data.token) {
      localStorage.setItem("token", response.data.token);
      return response.data.token;
    } else {
      // Handle login failure
      throw new Error("Sign up failed");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getWarehouses = async () => {
  try {
    const response = await api.get("/warehouses");

    if (response.data) {
      return response.data.data;
    }

    return [];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getInventoryStream = async (barcode: string) => {
  const eventSource = new EventSource(
    `http://localhost:8080/api/v1/inventory/${barcode}/stream`
  );

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Data received from server: ", data);
    // Update your frontend state here
  };
};
