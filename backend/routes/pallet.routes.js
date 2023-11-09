const express = require("express");

const outletOrderController = require("../controllers/pallet.controller");

const router = express.Router();

router.post("/pallet/create", outletOrderController.createPallet);
router.post("/pallet/update/:id", outletOrderController.updatePallet);
router.post("/pallet/delete/:id", outletOrderController.deletePallet);
router.get("/pallet/:id", outletOrderController.getOnePallet);
router.get("/pallets", outletOrderController.getAllPallets);

module.exports = router;
