const express = require("express");

const router = express.Router();

const { updateInventory, postInboundProcess, getInboundStream } = require("../controllers/iot.controller");

// MAIN ROUTE: /iot

router.post("/inbound", postInboundProcess);

router.get('/inbound-stream', getInboundStream)

module.exports = router;