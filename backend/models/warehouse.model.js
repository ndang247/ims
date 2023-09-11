const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema({
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
  parcels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parcel",
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
}, { timestamps: {
  createdAt: 'datetimecreated',
  updatedAt: 'datetimeupdated'
}});

const Warehouse =
  mongoose.model.Warehouse || mongoose.model("Warehouse", warehouseSchema);

module.exports = Warehouse;
