const express = require("express");

const {
  createProduct,
  getProduct,
  getProducts,
  searchProducts,
} = require("../controllers/product.controller");

const router = express.Router();

router.post("/product/create", createProduct);
router.get("/product", getProduct);
router.get("/products", getProducts);
router.get("/product/search", searchProducts);

module.exports = router;
