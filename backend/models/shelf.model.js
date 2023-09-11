const mongoose = require("mongoose");

const shelfSchema = new mongoose.Schema({
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },
  number: {
    type: String,
    unique: true,
    required: true,
  },
  location_in_warehouse: {
    type: String,
    required: true,
  },
  aisle: {
    type: String,
    required: true,
  },
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

const Shelf = mongoose.model.Shelf || mongoose.model("Shelf", shelfSchema);

module.exports = Shelf;
