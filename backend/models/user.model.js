const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: String,
  username: String,
  password: String, // Hashed password
  role: {
    type: String,
    enum: ["manager", "staff", "outlet", "supplier"],
    default: "worker",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  abn: String,
  address: String,
  phone: String,
  email: String,
  warehouses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" }],
});

const User = mongoose.model.User || mongoose.model("User", userSchema);

module.exports = User;
