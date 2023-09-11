const mongoose = require("mongoose");

const rfidSchema = new mongoose.Schema(
  {
    ref_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ref_object",
    },
    ref_object: {
      type: String,
      required: true,
      enum: ["Product", "Parcel"],
    },
    tag_data: {
      type: String,
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
  },
  {
    timestamps: {
      createdAt: "datetimecreated",
      updatedAt: "datetimeupdated",
    },
  }
);

const RFID = mongoose.model.RFID || mongoose.model("RFID", rfidSchema);

module.exports = RFID;
