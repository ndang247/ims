const Parcel = require("../models/parcel.model");
const Inventory = require("../models/inventory.model");
const Warehouse = require("../models/warehouse.model");
const Shelf = require("../models/shelf.model");
const Product = require("../models/product.model");

const { errorLogger } = require("../debug/debug");

const createParcel = async (req, res) => {
  try {
    const {
      warehouse,
      shelf,
      product,
      status,
      quantity, // Apply quantity limit on front-end
      datetimecreated = new Date(),
      datetimeupdated = new Date(),
    } = req.body;

    // Check if warehouse and product actually exist
    const warehouseExist = await Warehouse.findById(warehouse);
    const productExist = await Product.findById(product);

    if (warehouseExist && productExist) {
      for (let i = 0; i < quantity; i++) {
        // Create a new parcel
        const parcel = await Parcel.create({
          warehouse,
          shelf,
          product,
          status,
          datetimecreated,
          datetimeupdated,
        });
        await parcel.save();
      }

      // Update inventory parcel_quantity for the newly added parcels
      const inventory = await Inventory.findOne({ product });
      const inventoryUpdated = await Inventory.findByIdAndUpdate(
        inventory._id,
        { parcel_quantity: inventory.parcel_quantity + quantity },
        { new: true, useFindAndModify: false }
      );

      res.status(200).json({
        status: "Success",
        inventory: inventoryUpdated,
      });
    } else
      return res.status(404).json({
        status: "Not Found",
        message: "Warehouse or product not found",
      });
  } catch (error) {
    errorLogger("parcel.controller", "createParcel").error({
      message: error,
    });
    res.status(500).json({ status: "Error", error: error.message });
  }
};

module.exports = { createParcel };
