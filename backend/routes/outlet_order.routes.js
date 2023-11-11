const express = require("express");

const outletOrderController = require("../controllers/outlet_order.controller");

const router = express.Router();

router.post("/outlet/order/create", outletOrderController.create);
router.get("/outlet/orders", outletOrderController.getMany);
router.get("/outlet/orders/user/:id", outletOrderController.getByUserID);
router.post("/outlet/order/:id/update", outletOrderController.update);
router.post("/outlet/order/:id/delete", outletOrderController.delete);
router.post(
  "/outlet/order/:id/deliver",
  outletOrderController.updateOutletOrderStatusToOutForDelivery
);
router.get("/outlet/order/:id", outletOrderController.getSingle);

module.exports = router;
