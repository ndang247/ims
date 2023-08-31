const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
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
