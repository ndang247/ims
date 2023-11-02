import axios from "axios";
import {IOutletOrderModel , IUserModel} from '../types'

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
    const response = await api.post(
      "/inbound/barcode-input",
      {
        warehouse_id: DEFAULT_WAREHOUSE_ID,
        barcode,
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
      // localStorage.setItem("token", response.data.token);
      // return response.data.token;
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
}


export class User {

  static async getCurrent(): Promise<IUserModel> {
    try {
      const response = await api.get(`/users/profile`);
      return response.data.user as IUserModel;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async get(id: string): Promise<IUserModel> {
    if (!id) throw new Error("Invalid user id")
    try {
      const response = await api.get(`/users/${id}`);
      return response.data as IUserModel;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async add(user: IUserModel) {
    try {
      const response = await api.post(`/users`, user);
      return response.data as IUserModel;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async update(user: IUserModel) {
    if (!user._id) throw new Error("Invalid user id")

    try {
      const response = await api.post(`/users/${user._id}/update`, user);
      return response.data as IUserModel;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async delete(id: string) {
    if (!id) throw new Error("Invalid user id")

    try {
      const response = await api.post(`/users/${id}/delete`, {});
      return response.data as IUserModel;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async listUsers() {
    try {
      const response = await api.get(`/users`);
      return response.data as IUserModel[];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async verifyUser(id: string, status: 'accepted' | 'rejected') {
    try {
      await api.post(`/users/${id}/verify`, {
        status: status
      })
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
      return response.data as IOutletOrderModel;
    } catch (error) {
      throw error.response.data;
    }
  }

  // Update existing Outlet Order by ID
  static async updateOutletOrder(id: string, data: IOutletOrderModel) {
    try {
      const response = await api.post(`/outlet/order/${id}/update`, data);
      return response.data as IOutletOrderModel;
    } catch (error) {
      throw error.response.data;
    }
  }

  // Get single Outlet Order by ID
  static async getSingleOutletOrder(id: string) {
    try {
      const response = await api.get(`/outlet/order/${id}`);
      return response.data as IOutletOrderModel;
    } catch (error) {
      throw error.response.data;
    }
  }

  // Get all Outlet Orders
  static async getManyOutletOrders() {
    try {
      const response = await api.get("/outlet/orders");
      return response.data as IOutletOrderModel[];
    } catch (error) {
      throw error.response.data;
    }
  }

  // Delete Outlet Order by ID
  static async deleteOutletOrder(id: string) {
    try {
      const response = await api.post(`/outlet/order/${id}/delete`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}
