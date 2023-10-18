const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String, // Hashed password
  role: {
    type: String,
    enum: ["owner", "manager", "worker", "outlet", "supplier"],
    default: "worker",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  warehouses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" }],
});

const User = mongoose.model.User || mongoose.model("User", userSchema);

module.exports = User;
