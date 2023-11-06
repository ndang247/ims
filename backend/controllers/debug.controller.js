const Parcel = require("../models/parcel.model");
const Inventory = require("../models/inventory.model");
const Product = require("../models/product.model");
const RFID = require("../models/rfid.model");
const Inbound = require("../models/inbound.model");
const OutletOrder = require("../models/outlet_order.model");
const User = require("../models/user.model");

const { generateValidUPC } = require("./debug.controller.helper");

// const DEFAULT_WAREHOUSE_ID = process.env.DEFAULT_WAREHOUSE_ID;
const DEFAULT_WAREHOUSE_ID = "650041c789d9fbf5b33516ca";

async function addData() {
  console.log("Add parcels:", DEFAULT_WAREHOUSE_ID);

  const NO_PRODUCTS = 5;
  const NO_PARCELS = 5;

  try {
    for (let i = 0; i < NO_PRODUCTS; i++) {
      const upc = generateValidUPC();
      // Create and save product
      let product = await Product.findOne({ barcode: upc.upc });

      console.log("Product:", product);
      if (product) continue;

      product = new Product({
        barcode: upc.upc,
        upc_data: JSON.stringify(upc.upcData),
        datetimecreated: new Date(),
        datetimeupdated: new Date(),
      });
      await product.save();

      // Create and save inventory for the product
      const inventory = new Inventory({
        product: product._id,
        parcel_quantity: NO_PARCELS,
        datetimecreated: new Date(),
        datetimeupdated: new Date(),
      });
      await inventory.save();

      for (let j = 0; j < NO_PARCELS; j++) {
        const parcel = new Parcel({
          warehouse: DEFAULT_WAREHOUSE_ID,
          shelf: null,
          product: product._id,
          status: "in_warehouse", // Replace with actual status
          datetimecreated: new Date(),
          datetimeupdated: new Date(),
        });
        await parcel.save();

        // Create and save RFID for the parcel
        const rfid = new RFID({
          id: `rfid_${i}_${j}`,
          ref_id: parcel._id,
          ref_object: "Parcel",
          tag_data: `tag_data_${i}_${j}`, // Sample data
          status: "active", // Replace with actual status
          datetimecreated: new Date(),
          datetimeupdated: new Date(),
        });
        await rfid.save();
      }
    }
  } catch (error) {
    errorLogger("debug.controller", "addData").error({
      message: error,
    });
    res.status(500).json({ status: "Error", error: error.message });
  }
}

/**
 * Generate parcels for testing
 * Each parcel has a product and an RFID
 * Each product has one inventory
 */
const generateParcels = async (req, res) => {
  try {
    await addData();
    res
      .status(200)
      .json({ status: "Success", message: "Data added successfully" });
  } catch (error) {
    errorLogger("debug.controller", "generateParcels").error({
      message: error,
    });
    res.status(500).json({ status: "Error", error: error.message });
  }
};

/**
 * Remove all except warehouse and shelves
 * Remove all parcels with RFID, products with inventory, inbound, outlet orders and users
 */
const removeAll = async (req, res) => {
  try {
    await Promise.all([
      Inbound.deleteMany(),
      OutletOrder.deleteMany(),
      User.deleteMany(),
      Parcel.deleteMany(),
      Inventory.deleteMany(),
      Product.deleteMany(),
      RFID.deleteMany(),
    ]);
    res.status(200).json({
      status: "Success",
      message:
        "All Parcels with RFID, Products with Inventory, Inbound, Outlet Orders and Users have been removed successfully",
    });
  } catch (error) {
    errorLogger("debug.controller", "generateParcels").error({
      message: error,
    });
    res.status(500).json({ status: "Error", error: error.message });
  }
};

const removeAllParcelsForAProduct = async (req, res) => {
  try {
    const { id: product_id } = req.params;

    if (!product_id) {
      return res.status(400).json({
        status: "Error",
        message: "Product ID is required",
      });
    }
    const parcels = await Parcel.find({ product: product_id });

    let deleteOperations = [];

    for (let parcel of parcels) {
      deleteOperations.push(
        RFID.deleteMany({ ref_id: parcel._id, ref_object: "Parcel" })
      );
    }

    deleteOperations.push(Parcel.deleteMany({ product: product_id }));

    try {
      await Promise.all(deleteOperations);
    } catch (error) {
      console.error("Delete Error:", error);
      errorLogger("debug.controller", "generateParcels").error({
        message: error,
      });
      res.status(500).json({
        status: "Error",
        message: "Unable to delete parcels and RFIDs",
        error: error.message,
      });
    }

    const inventory = await Inventory.findOne({ product: product_id });
    inventory.parcel_quantity = 0;
    inventory.save();

    res
      .status(200)
      .send(
        "All Parcels with RFID have been removed successfully. Inventory has been updated to 0"
      );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: "Error", error: error.message });
  }
};

const generateParcelsToProducts = async (req, res) => {
  const { id: product_id } = req.params;

  const { no_parcels } = req.body;

  if (!product_id) {
    res.status(400).json({
      status: "Error",
      message: "Product ID is required",
    });
  }

  let NO_PARCELS = no_parcels ?? 5;

  for (let j = 0; j < NO_PARCELS; j++) {
    const parcel = new Parcel({
      warehouse: DEFAULT_WAREHOUSE_ID,
      shelf: null,
      product: product_id,
      status: "in_warehouse", // Replace with actual status
      datetimecreated: new Date(),
      datetimeupdated: new Date(),
    });
    await parcel.save();

    // Create and save RFID for the parcel
    const rfid = new RFID({
      id: `rfid_${i}_${j}`,
      ref_id: parcel._id,
      ref_object: "Parcel",
      tag_data: `tag_data_${i}_${j}`, // Sample data
      status: "active", // Replace with actual status
      datetimecreated: new Date(),
      datetimeupdated: new Date(),
    });
    await rfid.save();
  }
};

module.exports = {
  generateParcels,
  removeAll,
  removeAllParcelsForAProduct,
  generateParcelsToProducts,
};
