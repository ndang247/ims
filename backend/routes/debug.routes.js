const express = require("express");

const {
  generateParcels, 
  removeAll, 
  removeAllParcelsForAProduct, 
  generateParcelsToProducts
 } = require("../controllers/debug.controller");

const router = express.Router();

router.get('/debug/generateMany', generateParcels)
router.get('/debug/removeAll', removeAll)
router.get('/debug/removeParcelsForProduct/:id', removeAllParcelsForAProduct)
router.get('/debug/generateParcelsToProducts/:id', generateParcelsToProducts)

module.exports = router;