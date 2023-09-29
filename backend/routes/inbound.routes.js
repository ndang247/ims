const express = require("express");

const router = express.Router();

const { 
  postInboundBarcode,
  getInbound
} = require("../controllers/inbound.controller");

// MAIN ROUTE: /iot

router.post("/inbound/barcode-input", postInboundBarcode);
router.get("/inbound/get", getInbound)

module.exports = router;
