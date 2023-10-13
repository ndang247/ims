const express = require("express");

const router = express.Router();

const {
  inventoryStream,
  getInventory
} = require("../controllers/inventory.controller");

router.get("/inventory/:id", getInventory);
router.get("/inventory/:id/stream", inventoryStream);

module.exports = router;