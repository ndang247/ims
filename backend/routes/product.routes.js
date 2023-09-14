const express = require("express");

const { createProduct, getProduct, getProducts } = require("../controllers/product.controller");

const router = express.Router();

router.post("/product/create", createProduct);
router.get("/product/:id", getProduct);
router.get("/products", getProducts);

module.exports = router;
