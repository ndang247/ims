const OutletOrder = require("../models/outlet_order.model");
const Pallet = require("../models/pallet.model");
const Parcel = require("../models/parcel.model");

const outletOrderController = {
  // Create new Outlet Order
  async create(req, res) {
    try {
      const user = req.user;
      const { description, status, products, datetimecreated } = req.body;
      console.log("User", user);
      const newOrder = new OutletOrder({
        user: user._id,
        description,
        status: status ?? "pending",
        products,
        datetimecreated: datetimecreated ?? new Date(),
        datetimeupdated: new Date(),
      });

      const savedOrder = await newOrder.save();
      res.status(201).json({
        status: "Success",
        savedOrder,
      });
    } catch (error) {
      res.status(400).json({
        status: "Error",
        error: error.message,
      });
    }
  },

  // Update existing Outlet Order
  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        description,
        status,
        comment,
        products,
        datetimecreated,
        datetimeupdated = new Date(),
      } = req.body;

      const updatedOrder = await OutletOrder.findByIdAndUpdate(
        id,
        {
          description,
          status,
          comment,
          products,
          datetimecreated,
          datetimeupdated,
        },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({
          status: "Not Found",
          error: "Order not found",
        });
      }

      res.status(200).json({
        status: "Success",
        updatedOrder,
      });
    } catch (error) {
      res.status(400).json({
        status: "Error",
        error: error.message,
      });
    }
  },

  async updateOutletOrderStatusToOutForDelivery(req, res) {
    try {
      const orderId = req.params.id;
      const outletOrder = await OutletOrder.findById(orderId);
      if (!outletOrder) {
        res.status(400).json({
          status: "Error",
          error: "Order not found!",
        });
      }

      // Check if the order's status is one of the statuses that allows updating to "out_for_delivery"
      const validStatuses = ["in_warehouse", "on_shelf", "loaded_on_pallet"];
      if (!validStatuses.includes(outletOrder.status)) {
        res.status(400).json({
          status: "Error",
          error: "Order status does not allow update to out_for_delivery",
        });
      }

      // Get Pallets for the OutletOrder
      const pallets = await Pallet.find({ order: outletOrder._id });

      // Get Parcels from the Pallet(s)
      const parcels = await Parcel.find({
        pallet: { $in: pallets.map((pallet) => pallet._id) },
      });

      // Extract product IDs from parcels and remove duplicates
      let productIds = [...new Set(parcels.map((parcel) => parcel.product))];

      // Get Inventories for the products
      const inventories = await Inventory.find({
        product: { $in: productIds },
      });

      // Calculate parcel quantity of each product
      const productParcelCount = parcels.reduce((acc, parcel) => {
        const productId = parcel.product.toString();
        acc[productId] = (acc[productId] || 0) + 1;
        return acc;
      }, {});

      console.log("productParcelCount", productParcelCount);

      // Update inventory for all products
      let inventorySavePromises = [];
      for (const inventory of inventories) {
        const productId = inventory.product.toString();
        const deliveredParcelQuantity = productParcelCount[productId];

        if (deliveredParcelQuantity > inventory.parcel_quantity) {
          res.status(404).json({
            status: "Error",
            error: `Delivered product ${productId} has larger quantity than current inventory. Please recheck inventory for product ${productId}.`,
          });
        }
        inventory.parcel_quantity -= deliveredParcelQuantity;
        inventorySavePromises.push(inventory.save());
      }

      await Promise.all(inventorySavePromises);

      // Update status of all Pallets to "out_for_delivery"
      let palletsParcelsSavePromises = [];
      for (const pallet of pallets) {
        pallet.status = "out_for_delivery";
        palletsParcelsSavePromises.push(pallet.save());
      }

      // Update status of all Parcels to "out_for_delivery"
      for (const parcel of parcels) {
        parcel.status = "out_for_delivery";
        palletsParcelsSavePromises.push(parcel.save());
      }

      await Promise.all(palletsParcelsSavePromises);

      // Update status of OutletOrder to "out_for_delivery"
      outletOrder.status = "out_for_delivery";
      await outletOrder.save();

      res.status(200).json({
        status: "Success",
        order: outletOrder,
      });
    } catch (error) {
      console.error("Error updating order to out_for_delivery:", error);
      res.status(400).json({
        status: "Error",
        error: error.message,
      });
    }
  },

  // // Update existing Outlet Order, but also update the inventory number of each product
  // Next Step:
  // async update(req, res) {
  //   let session;
  //   try {
  //     const { id } = req.params;
  //     const user = req.user;
  //     const { description, status, products, datetimecreated } = req.body;

  //     // Fetch the existing order
  //     const existingOrder = await OutletOrder.findById(id);

  //     if (!existingOrder) {
  //       return res.status(404).json({ error: "Order not found" });
  //     }

  //     // Check if the status is changing to 'processed' from 'pending' or 'accepted'
  //     if (["pending", "accepted"].includes(existingOrder.status) && status === "processed") {

  //       // ... your inventory checking and updating logic goes here
  //       const productIds = products.map(p => p.product);
  //       const inventories = await Inventory.find({ product: { $in: productIds } });

  //       // Check Inventory Levels
  //       for (let orderedProduct of products) {
  //         const inventoryItem = inventories.find(inv => inv.product.toString() === orderedProduct.product);

  //         if (!inventoryItem) {
  //           return res.status(400).json({ error: `Inventory for product ${orderedProduct.product} not found.` });
  //         }

  //         if (inventoryItem.parcel_quantity < orderedProduct.quantity) {
  //           return res.status(400).json({ error: `Not enough inventory for product ${orderedProduct.product}.` });
  //         }
  //       }

  //       // Start a session for atomic operations
  //       session = await mongoose.startSession();
  //       session.startTransaction();

  //       // Update inventory for each product
  //       for (let orderedProduct of products) {
  //         await Inventory.findOneAndUpdate(
  //           { product: orderedProduct.product },
  //           { $inc: { parcel_quantity: -orderedProduct.quantity } },
  //           { session }
  //         );
  //       }
  //     }

  //     // Update the order (This is outside the if block, so the order will be updated regardless of status change)
  //     const updatedOrder = await OutletOrder.findByIdAndUpdate(
  //       id,
  //       { user: user._id, description, status, products, datetimecreated },
  //       { new: true, session }
  //     );

  //     if (!updatedOrder) {
  //       if (session) {
  //         await session.abortTransaction();
  //         session.endSession();
  //       }
  //       return res.status(404).json({ error: "Order not found" });
  //     }

  //     if (session) {
  //       await session.commitTransaction();
  //       session.endSession();
  //     }

  //     res.status(200).json(updatedOrder);
  //   } catch (error) {
  //     if (session) {
  //       await session.abortTransaction();
  //       session.endSession();
  //     }
  //     res.status(400).json({ error: error.message });
  //   }
  // }

  // Get Single Outlet Order
  async getSingle(req, res) {
    try {
      const { id } = req.params;
      let order = await OutletOrder.findById(id)
        .populate("user")
        .populate("products.product");

      if (!order) {
        return res.status(404).json({
          status: "Not Found",
          error: "Order not found",
        });
      }

      order = order.toObject();
      order.products = order.products.map((productItem) => {
        if (typeof productItem.product.upc_data === "string") {
          try {
            // Parse the JSON string to JSON object
            productItem.product.upc_data = JSON.parse(
              productItem.product.upc_data
            );
          } catch (err) {
            console.error("Error parsing JSON string: ", err);
          }
        }
        return productItem;
      });

      res.status(200).json({
        status: "Success",
        order,
      });
    } catch (error) {
      res.status(400).json({
        status: "Error",
        error: error.message,
      });
    }
  },

  async getMany(req, res) {
    try {
      const orders = await OutletOrder.find()
        .populate("user")
        .populate("products.product")
        .sort({ datetimecreated: -1 });

      const transformedOrders = orders.map((order) => {
        const orderObject = order.toObject();
        orderObject.products = orderObject.products.map((productItem) => {
          if (typeof productItem.product.upc_data === "string") {
            try {
              // Parse the JSON string to JSON object
              productItem.product.upc_data = JSON.parse(
                productItem.product.upc_data
              );
            } catch (err) {
              console.error("Error parsing JSON string: ", err);
            }
          }
          return productItem;
        });
        return orderObject;
      });

      res.status(200).json({
        status: "Success",
        orders: transformedOrders,
      });
    } catch (error) {
      res.status(400).json({
        status: "Error",
        error: error.message,
      });
    }
  },

  // Delete Outlet Order
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedOrder = await OutletOrder.findByIdAndDelete(id);

      if (!deletedOrder) {
        return res.status(404).json({
          staus: "Not Found",
          error: "Order not found",
        });
      }

      res.status(200).json({
        staus: "Success",
        message: "Order deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        staus: "Error",
        error: error.message,
      });
    }
  },

  async getByUserID(req, res) {
    try {
      const { id } = req.params;
      const orders = await OutletOrder.find({ user: id })
        .populate("user")
        .populate("products.product")
        .sort({ datetimecreated: -1 });

      const transformedOrders = orders.map((order) => {
        const orderObject = order.toObject();
        orderObject.products = orderObject.products.map((productItem) => {
          if (typeof productItem.product.upc_data === "string") {
            try {
              // Parse the JSON string to JSON object
              productItem.product.upc_data = JSON.parse(
                productItem.product.upc_data
              );
            } catch (err) {
              console.error("Error parsing JSON string: ", err);
            }
          }
          return productItem;
        });
        return orderObject;
      });

      res.status(200).json({
        status: "Success",
        orders: transformedOrders,
      });
    } catch (error) {
      res.status(400).json({
        status: "Error",
        error: error.message,
      });
    }
  },
};

module.exports = outletOrderController;
