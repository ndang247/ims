const mongoose = require("mongoose");

const Inventory = require("./inventory.model");

const productSchema = new mongoose.Schema(
  {
    barcode: {
      type: String,
      required: true,
    },
    upc_data: {
      type: String,
      required: true,
    },
    datetimecreated: {
      type: Date,
      required: true,
    },
    datetimeupdated: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "datetimecreated",
      updatedAt: "datetimeupdated",
    },
  }
);

const Product =
  mongoose.model.Product || mongoose.model("Product", productSchema);

module.exports = Product;
