const express = require("express");

const router = express.Router();

const {
  postInboundProcess,
  getInboundStream,
  getIoTHome,
} = require("../controllers/iot.controller");

// MAIN ROUTE: /iot

router.post("/inbound", postInboundProcess);
router.get("/inbound-stream", getInboundStream);
router.get("/", getIoTHome);

module.exports = router;
