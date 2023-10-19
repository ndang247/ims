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
      return response.data;
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

export const postLogout = () => {
  localStorage.removeItem("token");
  window.location.reload();
}

export const getWarehouses = async () => {
  try {
    const response = await api.get("/warehouses", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: localStorage.getItem("token"),
      },
    });

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
}

export type UserModel = {
  _id: string | null | undefined;
  username: string;
  password: string;
  role: string;
  status: string;
  warehouses: string[];
}
export class User {

  static async getCurrent(): Promise<UserModel> {
    try {
      const response = await api.get(`/users/profile`, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: localStorage.getItem("token"),
        },
      });
      return response.data.user as UserModel;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async get(id: string): Promise<UserModel> {
    if (!id) throw new Error("Invalid user id")
    try {
      const response = await api.get(`/users/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: localStorage.getItem("token"),
        },
      });
      return response.data as UserModel;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async add(user: UserModel) {
    try {
      const response = await api.post(`/users`, user, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: localStorage.getItem("token"),
        },
      });
      return response.data as UserModel;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async update(user: UserModel) {
    if (!user._id) throw new Error("Invalid user id")

    try {
      const response = await api.post(`/users/${user._id}/update`, user, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: localStorage.getItem("token"),
        },
      });
      return response.data as UserModel;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async delete(id: string) {
    if (!id) throw new Error("Invalid user id")

    try {
      const response = await api.post(`/users/${id}/delete`, {}, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: localStorage.getItem("token"),
        },
      });
      return response.data as UserModel;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async listUsers() {
    try {
      const response = await api.get(`/users`, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: localStorage.getItem("token"),
        },
      });
      return response.data as UserModel[];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async verifyUser(id: string, status: 'accepted' | 'rejected') {
    try {
      await api.post(`/users/${id}/verify`, {
        status: status
      }, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: localStorage.getItem("token"),
        }
      })
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

}
