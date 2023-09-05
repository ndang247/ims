const Parcel = require("../models/parcel.model");
const Product = require("../models/product.model");
const Warehouse = require("../models/warehouse.model");
const Inventory = require("../models/inventory.model");
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

      // Add parcel to a warehouse
      await Warehouse.findByIdAndUpdate(
        warehouse,
        {
          $push: {
            parcels: parcel._id,
          },
        },
        { new: true, useFindAndModify: false }
      );

      // Add parcel to a product
      await Product.findByIdAndUpdate(
        product,
        {
          $push: {
            parcels: parcel._id,
          },
        },
        { new: true, useFindAndModify: false }
      );
    }

    // Update an inventory for the new parcel
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
  } catch (error) {
    errorLogger("parcel.controller", "createParcel").error({
      message: error,
    });
    res.status(500).json({ status: "Error", error: error.message });
  }
};

module.exports = { createParcel };
