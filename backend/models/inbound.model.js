const mongoose = require("mongoose");

const inboundSchema = new mongoose.Schema(
  {
    barcode_input: {
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
  },
  {
    timestamps: {
      createdAt: "datetimecreated",
      updatedAt: "datetimeupdated",
    },
  }
);

const Inbound =
  mongoose.model.Inbound || mongoose.model("Inboud", inboundSchema);

module.exports = Inbound;
