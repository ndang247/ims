const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema(
  {
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    shelf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shelf",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    pallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pallet",
    },
    status: {
      type: String,
      enum: [
        "in_warehouse",
        "on_shelf",
        "loaded_on_pallet",
        "out_for_delivery",
        "delivered",
        "archived",
      ],
      required: true,
      default: "in_warehouse",
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

const Parcel = mongoose.model.Parcel || mongoose.model("Parcel", parcelSchema);

module.exports = Parcel;
