import axios from "axios";
import { IOutletOrder, IPallet, IUser } from "../types";

export const BASE_URL = "http://localhost:8080/api/v1"

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: localStorage.getItem("token"),
  },
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
      params: paramsObj,
    });
    return response.data;
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
    console.log("Error post inbound barcode");
    console.log(error);
    throw error;
  }
};

export const clearInboundBarcode = async () => {
  try {
    const response = await api.post("/inbound/clear", {
      warehouse_id: DEFAULT_WAREHOUSE_ID,
    });
    return response;
  } catch (error) {
    console.log("Error clear inbound barcode");
    console.log(error);
    throw error;
  }
};

export const getCurrentInbound = async () => {
  const response = await api.get("/inbound/get", {
    params: {
      warehouse_id: DEFAULT_WAREHOUSE_ID,
    },
  });
  return response.data;
};

export const getProducts = async () => {
  try {
    const response = await api.get("/products", {
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
    const response = await api.get(`/product/?id=${productID}`);
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
    } else if (response.data && response.data.error) {
      // Handle login failure
      throw new Error(response.data.error);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const postSignUp = async (
  fullname: string,
  username: string,
  password: string,
  role: string,
  email: string,
  phone: string,
  abn: string,
  address: string
) => {
  try {
    const response = await api.post("/signup", {
      fullname,
      username: username,
      password: password,
      role: role,
      email,
      phone,
      abn,
      address,
    });

    if (response.data && response.data.user) {
      return response.data.user;
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
    `${BASE_URL}/inventory/${barcode}/stream`
  );

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Data received from server:", data);
    // Update your frontend state here
  };
};

export class Product {
  static async searchProducts(query: string) {
    try {
      const response = await api.get(`/product/search?q=${query}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export class User {
  static async getCurrent(): Promise<IUser> {
    try {
      const response = await api.get(`/users/profile`);
      return response.data.user as IUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async get(id: string): Promise<IUser> {
    if (!id) throw new Error("Invalid user id");
    try {
      const response = await api.get(`/users/${id}`);
      return response.data as IUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async add(user: IUser) {
    try {
      const response = await api.post(`/users`, user);
      return response.data as IUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async update(user: IUser) {
    if (!user._id) throw new Error("Invalid user id");

    try {
      const response = await api.post(`/users/${user._id}/update`, user);
      return response.data as IUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async delete(id: string) {
    if (!id) throw new Error("Invalid user id");

    try {
      const response = await api.post(`/users/${id}/delete`, {});
      return response.data as IUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async listUsers() {
    try {
      const response = await api.get(`/users`);
      return response.data.users as IUser[];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async verifyUser(id: string, status: "accepted" | "rejected") {
    try {
      await api.post(`/users/${id}/verify`, {
        status: status,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export class OutletOrder {
  // Create new Outlet Order
  static async createOutletOrder(data: OutletOrder) {
    try {
      const response = await api.post("/outlet/order/create", data);
      return response.data as IOutletOrder;
    } catch (error: any) {
      throw error.response.data;
    }
  }

  // Update existing Outlet Order by ID
  static async updateOutletOrder(id: string, data: IOutletOrder) {
    try {
      const response = await api.post(`/outlet/order/${id}/update`, data);
      return response.data as IOutletOrder;
    } catch (error: any) {
      throw error.response.data;
    }
  }

  // Get single Outlet Order by ID
  static async getSingleOutletOrder(id: string) {
    try {
      const response = await api.get(`/outlet/order/${id}`);
      return response.data as IOutletOrder;
    } catch (error: any) {
      throw error.response.data;
    }
  }

  // Get all Outlet Orders
  static async getManyOutletOrders() {
    try {
      const response = await api.get("/outlet/orders");
      return response.data.orders as IOutletOrder[];
    } catch (error: any) {
      throw error.response.data;
    }
  }

  // Get all Outlet Orders by Outlet ID
  static async getManyOutletOrdersByOutletID(outletID: string) {
    try {
      const response = await api.get(`/outlet/orders/user/${outletID}`);
      return response.data.orders as IOutletOrder[];
    } catch (error: any) {
      throw error.response.data;
    }
  }

  // Delete Outlet Order by ID
  static async deleteOutletOrder(id: string) {
    try {
      const response = await api.post(`/outlet/order/${id}/delete`);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
}

export class Pallet {
  static async createPallet(data: IPallet) {
    try {
      const response = await api.post("/pallet/create", data);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }

  static async getPallets(orderId?: string) {
    try {
      let url = "/pallets"
      if (orderId && orderId.trim().length !== 0) {
        url += `?order=${orderId}`
      }
      const response = await api.get(url);
      return response.data.pallets as IPallet[];
    } catch (error: any) {
      throw error.response.data;
    }
  }
}
