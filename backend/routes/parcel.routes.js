const express = require("express");

const {
  createParcel,
  getParcels,
  getParcelsByPalletID,
} = require("../controllers/parcel.controller");

const router = express.Router();

router.post("/parcel/create", createParcel);
router.get("/parcels", getParcels);
router.get("/parcels/pallet/:palletID", getParcelsByPalletID);
module.exports = router;
