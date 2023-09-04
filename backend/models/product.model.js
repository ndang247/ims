const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
  },
  shelf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shelf",
  },
  barcode: {
    type: String,
    required: true,
  },
  status: {
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
});

const Product =
  mongoose.model.Product || mongoose.model("Product", productSchema);

module.exports = Product;
