const Product = require("../models/product.model");
const Warehouse = require("../models/warehouse.model");
const Inventory = require("../models/inventory.model");
const { errorLogger } = require("../debug/debug");

const createProduct = async (req, res) => {
  try {
    const {
      warehouse,
      shelf,
      barcode,
      status,
      datetimecreated = new Date(),
      datetimeupdated = new Date(),
    } = req.body;

    const productExist = await Product.findOne({ barcode });

    if (productExist) {
      // Update the inventory quantity of the existing product
      const inventory = await Inventory.findOne({ product: productExist._id });
      const inventoryUpdated = await Inventory.findByIdAndUpdate(
        inventory._id,
        { quantity: inventory.quantity + 1 },
        { new: true, useFindAndModify: false }
      );

      // Create a new product with the same barcode
      const product = await Product.create({
        warehouse,
        shelf,
        barcode,
        status,
        datetimecreated,
        datetimeupdated,
      });

      // Also add the product to the warehouse
      const warehouseUpdated = await Warehouse.findByIdAndUpdate(
        warehouse,
        { $push: { products: product._id } },
        { new: true, useFindAndModify: false }
      );

      return res.status(201).json({
        message: "Product added to warehouse and inventory",
        item: product,
        warehouse: warehouseUpdated,
        inventory: inventoryUpdated,
      });
    }

    // Create a new product
    const product = await Product.create({
      warehouse,
      shelf,
      barcode,
      status,
      datetimecreated,
      datetimeupdated,
    });

    // Add product to warehouse
    const warehouseUpdated = await Warehouse.findByIdAndUpdate(
      warehouse,
      { $push: { products: product._id } },
      { new: true, useFindAndModify: false }
    );

    // Create an inventory for the new product
    const inventory = await Inventory.create({
      product: product._id,
      quantity: 1,
      datetimecreated,
      datetimeupdated,
    });

    res.status(200).json({
      status: "Success",
      item: product,
      warehouse: warehouseUpdated,
      inventory,
    });
  } catch (error) {
    errorLogger("product.controller", "createProduct").error({
      message: error,
    });
    res.status(500).json({ status: "Error", error: error.message });
  }
};

module.exports = { createProduct };
