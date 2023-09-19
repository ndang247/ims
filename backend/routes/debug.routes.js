const express = require("express");

const {
  generateParcels, 
  removeAll, 
  removeAllParcelsForAProduct, 
  generateParcelsToProducts
 } = require("../controllers/debug.controller");

const router = express.Router();

/** 
 * Generate random parcel within defined product in debug.controller.helper.generateValidUPC()
*/
router.get('/debug/generateMany', generateParcels)

/**
 * Remove all parcels with RFID, products with inventory
 * 
 * Won't remove warehouse and shelves
 */
router.get('/debug/removeAll', removeAll)

/**
 * Remove all parcels with RFID for a product
 */
router.get('/debug/removeParcelsForProduct/:id', removeAllParcelsForAProduct)

/**
 * Generate parcels for testing
 * Each parcel has an RFID
 * Each product has one inventory
 * 
 * @requestBody {no_parcels} - Number of parcels to generate
 */
router.get('/debug/generateParcelsToProducts/:id', generateParcelsToProducts)

module.exports = router;