const express = require("express");

const { createWarehouse } = require("../controllers/warehouse.controller");

const router = express.Router();

router.post("/create", createWarehouse);

module.exports = router;
