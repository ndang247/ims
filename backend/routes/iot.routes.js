const express = require("express");

const router = express.Router();

const { updateInventory, getInboundStream } = require("../controllers/iot.controller");

// MAIN ROUTE: /iot

router.post("/inbound", updateInventory);

router.get('/inbound-stream', getInboundStream)

module.exports = router;