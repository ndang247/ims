const express = require("express");

const router = express.Router();

const {
  inventoryStream,
} = require("../controllers/inventory.controller");

const {
  dashboardStream
} = require("../controllers/stream.controller")

router.get("/stream/inventory/:id", inventoryStream);
router.get("/stream/dashboard", dashboardStream)

module.exports = router;