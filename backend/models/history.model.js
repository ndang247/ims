const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
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
    enum: ["Product", "RFID"],
  },
  history: {
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
}, { timestamps: {
  createdAt: 'datetimecreated',
  updatedAt: 'datetimeupdated'
}});

const History =
  mongoose.model.History || mongoose.model("History", historySchema);

module.exports = History;
