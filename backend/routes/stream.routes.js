const express = require("express");

const router = express.Router();

const {
  dashboardStream,
  inventoryStream,
  outboundStream,
} = require("../controllers/stream.controller");

router.get("/stream/inventory/:id", inventoryStream);
router.get("/stream/dashboard", dashboardStream);
router.get("/stream/outbound", outboundStream);

module.exports = router;
