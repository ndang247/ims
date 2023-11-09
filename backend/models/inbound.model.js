const mongoose = require("mongoose");

const inboundSchema = new mongoose.Schema(
  {
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    barcode_input: {
      type: String,
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

const Inbound =
  mongoose.model.Inbound || mongoose.model("Inbound", inboundSchema);

module.exports = Inbound;
