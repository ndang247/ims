const express = require("express");

const { createParcel } = require("../controllers/parcel.controller");

const router = express.Router();

router.post("/parcel/create", createParcel);

module.exports = router;
