const express = require("express");

const {
  getWarehouses,
  createWarehouse,
} = require("../controllers/warehouse.controller");

const router = express.Router();

router.get("/warehouses", getWarehouses);
router.post("/warehouse/create", createWarehouse);

module.exports = router;
