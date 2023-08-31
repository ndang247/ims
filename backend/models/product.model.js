const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  barcode: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  inventory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inventory",
  },
  rfid_tag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RFID",
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
