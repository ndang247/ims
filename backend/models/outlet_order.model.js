const mongoose = require("mongoose");

const outletOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "processed",
        "out_for_delivery",
        "delivered",
        "rejected",
      ],
      default: "pending",
      required: true,
    },
    comment: {
      type: String,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
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
  },
  {
    timestamps: {
      createdAt: "datetimecreated",
      updatedAt: "datetimeupdated",
    },
  }
);

const OutletOrder =
  mongoose.model.OutletOrder ||
  mongoose.model("OutletOrder", outletOrderSchema);

module.exports = OutletOrder;
