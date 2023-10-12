const express = require("express");

const {
  getWarehouses,
  createWarehouse,
} = require("../controllers/warehouse.controller");

const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();

router.get("/warehouses", getWarehouses);
router.post("/warehouse/create", authenticateJWT, createWarehouse);

module.exports = router;
