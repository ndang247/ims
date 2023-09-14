const express = require("express");

const { createParcel, getParcels } = require("../controllers/parcel.controller");

const router = express.Router();

router.post("/parcel/create", createParcel);
router.get("/parcels", getParcels);

module.exports = router;
