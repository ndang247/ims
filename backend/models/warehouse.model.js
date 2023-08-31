const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  shelves: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shelf",
    },
  ],
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  datetimecreated: {
    type: Date,
    required: true,
  },
  datetimeupdated: {
    type: Date,
    required: true,
  },
});

const Warehouse =
  mongoose.model.Warehouse || mongoose.model("Warehouse", warehouseSchema);

module.exports = Warehouse;
