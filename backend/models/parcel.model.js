const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema({
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
  },
  shelf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shelf",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
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

const Parcel = mongoose.model.Parcel || mongoose.model("Parcel", parcelSchema);

module.exports = Parcel;
