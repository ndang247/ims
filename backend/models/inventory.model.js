const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  parcel_quantity: {
    type: Number,
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

const Inventory =
  mongoose.model.Inventory || mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
