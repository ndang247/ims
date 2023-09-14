const express = require("express");

const { createProduct, getProduct } = require("../controllers/product.controller");

const router = express.Router();

router.post("/product/create", createProduct);
router.get("/product/:id", getProduct);

module.exports = router;
