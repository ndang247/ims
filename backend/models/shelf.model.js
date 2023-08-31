const mongoose = require("mongoose");

const shelfSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  number: {
    type: Number,
    required: true,
  },
  location_in_warehouse: {
    type: String,
    required: true,
  },
  aisle: {
    type: Number,
    required: true,
  },
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

const Shelf = mongoose.model.Shelf || mongoose.model("Warehouse", shelfSchema);

module.exports = Shelf;
