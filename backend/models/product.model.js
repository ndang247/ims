const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  barcode: {
    type: String,
    required: true,
  },
  upc_data: {
    type: String,
    required: true,
  },
  parcels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parcel",
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
});

const Product =
  mongoose.model.Product || mongoose.model("Product", productSchema);

module.exports = Product;
