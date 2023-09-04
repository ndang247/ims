const mongoose = require("mongoose");

const rfidSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  ref_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ref_object",
  },
  ref_object: {
    type: String,
    required: true,
    enum: ["product"],
  },
  tag_data: {
    type: String,
    required: true,
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

const RFID = mongoose.model.RFID || mongoose.model("RFID", rfidSchema);

module.exports = RFID;
