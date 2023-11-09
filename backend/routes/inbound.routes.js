const express = require("express");

const router = express.Router();

const {
  postInboundBarcode,
  getInbound,
  clearInboundBarcode,
} = require("../controllers/inbound.controller");

// MAIN ROUTE: /iot

router.post("/inbound/barcode-input", postInboundBarcode);
router.post("/inbound/clear", clearInboundBarcode);
router.get("/inbound/get", getInbound);

module.exports = router;
